Ext.define('Ext.ux.panel.Wizard', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.panel.CardLayout',
        'Ext.ux.panel.Card',
        'Ext.ux.panel.Header'
    ],
    //layout: 'Ext.ux.panel.CardLayout',
    alias: 'widget.wizard',
    layout: 'fit',
    loadMaskConfig: {
        'default': '',
        'saving': 'Saving...',
        'checking': 'Checking...'
    },
    autoRender: true,

    /**
    * @cfg {Number} height The height of the dialog. Defaults to "400".
    */
    //height: 650,

    /**
    * @cfg {Number} width The width of the dialog. Defaults to "540".
    */
    //width: 800,

    /**
    * @cfg {Boolean} closable Wether the dialog is closable. Defaults to "true".
    * This property will be changed by the "switchDialogState"-method, which will
    * enable/disable controls based on the passed argument. Thus, this config property
    * serves two purposes: Tell the init config to render a "close"-tool, and create a
    * "beforeclose"-listener which will either return true or false, indicating if the
    * dialog may be closed.
    */
    closable: true,

    /**
    * @cfg {Boolean} resizable Wether the dialog is resizable. Defaults to "false".
    */
    resizable: false,

    /**
    * @cfg {Boolean} resizable Wether the dialog is modal. Defaults to "true".
    */
    modal: true,

    /**
    * @cfg {Boolean} defines whether to close the wizard when the finish event is fired. Defaults to "true".
    */
    closeOnFinish: true,

    /**
    * @cfg {Array} cards A numeric array with the configured {@link Ext.ux.Wiz.Card}s.
    * The index of the cards in the array represent the order in which they get displayed
    * in the wizard (i.e. card at index 0 gets displayed in the first step, card at index 1 gets
    * displayed in the second step and so on).
    */
    cards: [],

    /**
    * @cfg {String} previousButtonText The text to render the previous-button with.
    * Defaults to "&lt; Back" (< Back)
    */
    previousButtonText: '&lt; Previous',

    /**
    * @cfg {String} nextButtonText The text to render the next-button with.
    * Defaults to "Next &gt;" (Next >)
    */
    nextButtonText: 'Next &gt;',

    /**
    * @cfg {String} cancelButtonText The text to render the cancel-button with.
    * Defaults to "Cancel"
    */
    cancelButtonText: 'Cancel',

    /**
    * @cfg {String} finishButtonText The text to render the next-button with when the last
    * step of the wizard is reached. Defaults to "Finish"
    */
    finishButtonText: 'Finish',

    /**
    * @cfg {Object} headerConfig A config-object to use with {@link Ext.ux.Wiz.Header}.
    * If not present, it defaults to an empty object.
    */
    headConfig: null,

    /**
    * @cfg {Object} sideConfig A config-object to use with {@link Ext.ux.Wizard}.
    * If not present, it defaults to an empty object.
    */
    sideConfig: null,

    /**
    * @cfg {Object} cardPanelConfig A config-object to use with {@link Ext.Panel}, which
    * represents the card-panel in this dialog.
    * If not present, it defaults to an empty object
    */
    cardPanelConfig: {},

    /**
    * @param {Ext.Button} The window-button for paging to the previous card.
    * @private
    */
    previousButton: null,

    /**
    * @param {Ext.Button} The window-button for paging to the next card. When the
    * last card is reached, the event fired by and the text rendered to this button
    * will change.
    * @private
    */
    nextButton: null,

    /**
    * @param {Ext.Button} The window-button for canceling the wizard. The event
    * fired by this button will usually close the dialog.
    * @private
    */
    cancelButton: null,

    /**
    * @param {Ex.Panel} The card-panel that holds the various wizard cards
    * ({@link Ext.ux.Wiz.Card}). The card-panel itself uses the custom
    * {@link Ext.ux.layout.CardLayout}, which needs to be accessible by this class.
    * You can get it at {@link http://www.siteartwork.de/cardlayout}.
    * @private
    */
    cardPanel: null,

    /**
    * @param {Number} currentCard The current {@link Ext.ux.Wiz.Card} displayed.
    * Defaults to 0.
    * @private
    */
    currentCard: 0,

    /**
    * @param {Ext.ux.Wiz.Header} The header-panel of the wizard.
    * @private
    */
    headPanel: null,

    /**
    * @param {Number} cardCount Helper for storing the number of cards used
    * by this wizard. Defaults to 0 (inherits "cards.length" later on).
    * @private
    */
    cardCount: 0,

    /**
    * Inits this component with the specified config-properties and automatically
    * creates its components.
    */
    initComponent: function () {

        var me = this,
            c = me.initialConfig,
            sregion,
            hregion;

        if (!me.sideConfig) { me.sideConfig = {}; }
        if (!me.headConfig) { me.headConfig = {}; }

        if (c.sideConfig && c.sideConfig.position === 'right') { sregion = 'east'; } else { sregion = 'west'; }
        if (c.headConfig && c.headConfig.position === 'bottom') { hregion = 'south'; } else { hregion = 'north'; }

        Ext.applyIf(me.cardPanelConfig, { region: 'center', items: me.cards || [{}], layout: Ext.create('Ext.ux.panel.CardLayout'), border: false, activeItem: 0, baseCls: 'ux-wizard-cardpanel' });
        Ext.applyIf(me.sideConfig, { region: sregion, width: 150, layout: 'fit', xtype: 'wizardheader', headerPosition: 'side', steps: me.cards.length, hidden: !c.sideConfig });
        Ext.applyIf(me.headConfig, { region: hregion, height: 150, layout: 'fit', xtype: 'wizardheader', headerPosition: 'top', steps: me.cards.length, hidden: !c.headConfig });

        me.initButtons();
        me.initPanels();

        var title = me.title || me.headConfig.title;
        title = title || "";

        var items = [];

        items.push(me.sidePanel);
        items.push(me.headPanel);
        items.push(me.cardPanel);

        Ext.apply(this, {
            title: title,
            layout: 'border',
            cardCount: me.cards.length,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                defaults: { minWidth: 60 },
                items: [
                    { xtype: 'component', flex: 1 },
                    me.previousButton,
                    me.nextButton,
                    me.cancelButton
                ]
            }],
            items: items
        });

        //me.addEvents(
        /**
        * @event cancel
        * Fires after the cancel-button has been clicked.
        * @param {Ext.ux.Wiz} this
        */
        //    'cancel',
        /**
        * @event finish
        * Fires after the last card was reached in the wizard and the
        * next/finish-button has been clicked.
        * @param {Ext.ux.Wiz} this
        * @param {Object} data The collected data of the cards, whereas
        * the index is the id of the card and the specific values
        * are objects with key/value pairs in the form formElementName : value
        */
        //    'finish'
        //);

        me.callParent();
    },

    // -------- helper
    /**
    * Returns the form-data of all cards in this wizard. The first index is the
    * id of the card in this wizard,
    * and the values are objects containing key/value pairs in the form of
    * fieldName : fieldValue.
    *
    * @returns {Array} array of all the various sections of the wizard
    */
    getWizardData: function () {
        var formValues = {},
            id,
            cards = this.cards;
        for (var i = 0, len = cards.length; i < len; i = i + 1) {
            id = cards[i].itemId ? cards[i].itemId : cards[i].id;
            if (cards[i].form) {
                formValues[id] = cards[i].form.getValues(false);
            } else {
                formValues[id] = {};
            }
        }

        return formValues;
    },

    /**
    * Switches the state of this wizard between disabled/enabled.
    * A disabled dialog will have a {@link Ext.LoadMask} covering the card-panel
    * to prevent user input, and the buttons will be rendered disabled/enabled.
    * If the dialog is closable, the close-tool will be masked, too, and the dialog will not
    * be closable by clicking the "close" tool.
    *
    * @param {Boolean} enabled "false" to prevent user input and mask the elements,
    * otherwise true.
    * @param {String} type The type of msg for the {@Ext.LoadMask} covering
    * the cardPanel, as defined in the cfg property "loadMaskConfig"
    */
    switchDialogState: function (enabled, type) {
        var me = this,
            ct = me.tools.close;

        me.showLoadMask(!enabled, type);

        me.previousButton.setDisabled(!enabled);
        me.nextButton.setDisabled(!enabled);
        me.cancelButton.setDisabled(!enabled);

        if (ct) {
            if (enabled) {
                me.tools.close.unmask();
            } else {
                me.tools.close.mask();
            }
        }

        me.closable = enabled;
    },

    /**
    * Shows the load mask for this wizard. By default, the cardPanel's body
    * will be masked.
    *
    * @param {Boolean} show true to show the load mask, otherwise false.
    * @param {String} type The type of message for the {@Ext.LoadMask} covering
    * the cardPanel, as defined in the cfg property "loadMaskConfig"
    */
    showLoadMask: function (show, type) {
        var me = this;
        if (!type) {
            type = 'default';
        }

        if (show) {
            if (me.loadMask === null) {
                me.loadMask = new Ext.LoadMask(me.body);
            }
            me.loadMask.msg = me.loadMaskConfig[type];
            me.loadMask.show();
        } else {
            if (me.loadMask) {
                me.loadMask.hide();
            }
        }
    },


    /**
    * show the side panel
    *
    */
    showSidePanel: function () {
        this.sidePanel.show();
    },


    /**
    * show the side panel
    *
    */
    showHeadPanel: function () {
        this.headPanel.show();
    },


    /**
    * hide the side panel
    *
    */
    hideSidePanel: function () {
        this.sidePanel.hide();
    },


    /**
    * hide the head panel
    *
    */
    hideHeadPanel: function () {
        this.headPanel.hide();
    },

    /**
    * Inits the listener for the various {@link Ext.ux.Wiz.Card}s used
    * by this component.
    */
    initEvents: function () {
        var me = this;
        me.callParent();
        me.on('beforeclose', me.onBeforeClose, me);
    },

    /**
    * Creates the head- and the card-panel.
    * Be sure to have the custom {@link Ext.ux.layout.CardLayout} available
    * in order to make the card-panel work as expected by this component
    * ({@link http://www.siteartwork.de/cardlayout}).
    */
    initPanels: function () {
        var me = this,
            cards = me.cards;
        cardPanelConfig = me.cardPanelConfig;

        Ext.apply(me.headConfig, {
            steps: me.cards.length
        });

        me.headPanel = Ext.create('Ext.ux.panel.Header', me.headConfig);
        me.sidePanel = Ext.create('Ext.ux.panel.Header', me.sideConfig);

        Ext.apply(cardPanelConfig, {
            layout: 'card', // new Ext.ux.panel.CardLayout(),
            items: cards
        });

        Ext.applyIf(cardPanelConfig, {
            region: 'center',
            border: false,
            activeItem: 0
        });

        for (var i = 0, len = cards.length; i < len; i = i + 1) {
            cards[i].on('show', me.onCardShow, me);
            cards[i].on('hide', me.onCardHide, me);
            cards[i].on('clientvalidation', me.onClientValidation, me);
        }

        me.cardPanel = Ext.create('Ext.panel.Panel', cardPanelConfig);
    },

    /**
    * Creates the instances for the the window buttons.
    */
    initButtons: function () {
        var me = this;

        me.previousButton = Ext.create('Ext.button.Button', {
            text: me.previousButtonText,
            id: 'wizard-move-prev',
            disabled: true,
            minWidth: 75,
            handler: me.onPreviousClick,
            scope: me
        });

        me.nextButton = Ext.create('Ext.button.Button', {
            text: me.nextButtonText,
            id: 'wizard-move-next',
            itemId: 'wizardNextButton',
            minWidth: 75,
            handler: me.onNextClick,
            scope: me
        });

        me.cancelButton = Ext.create('Ext.button.Button', {
            text: me.cancelButtonText,
            handler: me.onCancelClick,
            scope: me,
            minWidth: 75
        });

    },

    // -------- listeners

    /**
    * Listener for the beforeclose event.
    * This listener will return true or false based on the "closable"
    * property by this component. This property will be changed by the "switchDialogState"
    * method, indicating if there is currently any process running that should prevent
    * this dialog from being closed.
    *
    * @param {Ext.Panel} panel The panel being closed
    *
    * @return {Boolean}
    */
    onBeforeClose: function (panel) {
        return this.closable;
    },

    /**
    * By default, the card firing this event monitors user input in a frequent
    * interval and fires the 'clientvalidation'-event along with it. This listener
    * will enable/disable the next/finish-button in accordance with it, based upon
    * the parameter isValid. isValid" will be set by the form validation and depends
    * on the validators you are using for the different input-elemnts in your form.
    * If the card does not contain any forms, this listener will never be called by the
    * card itself.
    *
    * @param {Ext.ux.Wiz.Card} The card that triggered the event.
    * @param {Boolean} isValid "true", if the user input was valid, otherwise
    * "false"
    */
    onClientValidation: function (card, isValid) {
        var me = this;
        if (!isValid) {
            me.nextButton.setDisabled(true);
        } else {
            me.nextButton.setDisabled(false);
        }
    },

    /**
    * This will render the "next" button as disabled since the bindHandler's delay
    * of the next card to show might be lagging on slower systems
    *
    */
    onCardHide: function (card) {
        var me = this;
        if (me.cardPanel.layout.activeItem.id === card.id) {
            me.nextButton.setDisabled(true);
        }
    },


    /**
    * Listener for the "show" event of the card that gets shown in the card-panel.
    * Renders the next/previous buttons based on the position of the card in the wizard
    * and updates the head-panel accordingly.
    *
    * @param {Ext.ux.Wiz.Card} The card being shown.
    */
    onCardShow: function (card) {
        var me = this,
            parent = card.ownerCt,
            items = parent.items;

        for (var i = 0, len = items.length; i < len; i = i + 1) {
            if (items.get(i).id === card.id) {
                break;
            }
        }

        me.currentCard = i;
        me.headPanel.updateStep(i, card.title);
        me.sidePanel.updateStep(i, card.title);

        if (i === len - 1) {
            me.nextButton.setText(me.finishButtonText);
        } else {
            me.nextButton.setText(me.nextButtonText);
        }

        if (card.isValid()) {
            me.nextButton.setDisabled(false);
        }

        if (i === 0) {
            me.previousButton.setDisabled(true);
        } else {
            me.previousButton.setDisabled(false);
        }

    },


    /**
    * Fires the 'cancel'-event. Closes this dialog if the return value of the
    * listeners does not equal to "false".
    */
    onCancelClick: function () {
        var me = this;
        if (me.fireEvent('cancel', me, me.getWizardData()) !== false) {
            me.closable = true;
            me.close();
        }
    },

    /**
    * Fires the 'finish'-event. Closes this dialog if the return value of the
    * listeners does not equal to "false".
    */
    onFinish: function () {
        var me = this;
        if (me.fireEvent('finish', me, me.getWizardData()) !== false) {
            me.closable = true;
            if (me.closeOnFinish) {
                me.close();
            }
        }
    },

    /**
    * Listener for the previous-button.
    * Switches to the previous displayed {@link Ext.ux.Wiz.Card}.
    */
    onPreviousClick: function (btn) {
        var me = this, mywiz;
        if (me.currentCard > 0) {
            // me.cardPanel.getLayout().setActiveItem(me.currentCard - 1);
            mywiz = btn.up('panel').cardPanel;
            me.navigate(mywiz, 'prev');
        }
    },

    /**
    * Listener for the next-button. Switches to the next {@link Ext.ux.Wiz.Card}
    * if the 'beforehide'-method of it did not return false. The functionality
    * for this is implemented in {@link Ext.ux.layout.CardLayout}, which is needed
    * as the layout for the card-panel of this component.
    */
    onNextClick: function (btn) {
        var me = this, p, f;

        if (me.currentCard === me.cardCount - 1) {
            me.onFinish();
        } else {
            // me.cardPanel.getLayout().setActiveItem(me.currentCard + 1);
            p = me.cardPanel.items.items[me.currentCard];
            if (p) {
                f = p.getForm();
                if (f.isValid()) {
                    me.navigate(btn.up('panel').cardPanel, "next");
                } else {
                    p.items.items[0].el.frame("#ff0000");
                }
            }
        }
    },
    navigate: function (panel, direction) {
        // This routine could contain business logic required to manage the navigation steps.
        // It would call setActiveItem as needed, manage navigation button state, handle any
        // branching logic that might be required, handle alternate actions like cancellation
        // or finalization, etc. A complete wizard implementation could get pretty
        // sophisticated depending on the complexity required, and should probably be
        // done as a subclass of CardLayout in a real-world implementation.
        var layout = panel.getLayout();
        var me = this;
        layout[direction]();
        Ext.getCmp('wizard-move-prev').setDisabled(!layout.getPrev());
        if (me.currentCard !== me.cards.length - 1) {
            Ext.getCmp('wizard-move-next').setDisabled(!layout.getNext());
        }
    } //,
    /*
    afterRender: function () {
    var me = this, ly;
    me.callParent();

    ly = me.cardPanel.getLayout();
    }
    */
});