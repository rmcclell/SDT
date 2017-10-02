/**
 * Licensed under GNU LESSER GENERAL PUBLIC LICENSE Version 3
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 * @url http://www.siteartwork.de/wizardcomponent
 */

/**
 * @class Ext.ux.Wiz.Card
 * @extends Ext.FormPanel
 *
 * A specific {@link Ext.FormPanel} that can be used as a card in a
 * {@link Ext.ux.Wiz}-component. An instance of this card does only work properly
 * if used in a panel that uses a {@see Ext.layout.CardLayout}-layout.
 *
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.ux.panel.Card', {
    extend: 'Ext.form.Panel',
    cardTitle: '',
    cls: 'ux-wiz-card',

    /**
    * @cfg {Boolean} header "True" to create the header element. Defaults to
    * "false". See {@link Ext.form.FormPanel#header}
    */
    header: false,

    /**
    * @cfg {Strting} hideMode Hidemode of this component. Defaults to "offsets".
    * See {@link Ext.form.FormPanel#hideMode}
    */
    hideMode: 'display',

    initComponent: function () {

        var me = this;

        //me.addEvents(
        /**
        * @event beforecardhide
        * If you want to add additional checks to your card which cannot be easily done
        * using default validators of input-fields (or using the monitorValid-config option),
        * add your specific listeners to this event.
        * This event gets only fired if the activeItem of the ownerCt-component equals to
        * this instance of {@see Ext.ux.Wiz.Card}. This is needed since a card layout usually
        * hides it's items right after rendering them, involving the beforehide-event.
        * If those checks would be attached to the normal beforehide-event, the card-layout
        * would never be able to hide this component after rendering it, depending on the
        * listeners return value.
        *
        * @param {Ext.ux.Wiz.Card} card The card that triggered the event
        */
        //    'beforecardhide'
        //);

        me.cardTitle = me.title;
        me.titleStyle = !Ext.isEmpty(me.titleStyle) ? me.titleStyle : '';
        me.titleCls = !Ext.isEmpty(me.titleCls) ? me.titleCls : '';
        me.title = me.showTitle ? '<span style="' + me.titleStyle + '" class="' + me.titleCls + '" >' + me.title + '</span>' : '';

        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'component',
                errorpanel: true,
                baseCls: 'form-error-state',
                margin: 10,
                flex: 1,
                validText: me.validText,
                invalidText: me.invalidText || 'Error/s detected. Please modify...',
                tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li><span class="field-name">{name}</span>: <span class="error">{error}</span></li></tpl></ul>'),
                getTip: function () {
                    var tip = me.tip;
                    if (!tip) {
                        tip = Ext.create('Ext.tip.ToolTip', {
                            target: me.el,
                            autoShow: false, //Showing tool tip is cause field to loose focus while typing
                            title: 'Error Details:',
                            focusOnToFront: false,
                            toFrontOnShow: false,
                            anchor: 'top',
                            cls: 'errors-tip'
                        });
                        me.tip = tip;
                    }
                    return tip;
                },

                setErrors: function (errors) {
                    var me = this,
                        baseCls = me.baseCls,
                        tip = me.getTip();

                    errors = Ext.Array.from(errors);

                    // Update CSS class and tooltip content
                    if (errors.length) {
                        me.addCls(baseCls + '-invalid');
                        me.removeCls(baseCls + '-valid');
                        me.update(me.invalidText);
                        tip.setDisabled(false);
                        tip.update(me.tipTpl.apply(errors));
                    } else {
                        me.addCls(baseCls + '-valid');
                        me.removeCls(baseCls + '-invalid');
                        me.update(me.validText);
                        tip.setDisabled(true);
                    }

                }
            }]
        }];

        if (me.description) {
            me.dockedItems.push({
                xtype: 'toolbar',
                cls: 'ext-ux-wiz-Header-description',
                dock: 'top',
                ui: 'header',
                layout: 'fit',
                border: false,
                items: [{
                    // Fieldset in Column 1 - collapsible via toggle button
                    xtype: 'container',
                    border: false,
                    margin: 5,
                    html: me.description
                }]
            });
        }

        me.callParent();

    },

    // -------- helper
    isValid: function () {
        return !this.getForm().isDirty();
    },

    // -------- overrides

    /**
    * Overrides parent implementation since we allow to add any element
    * in this component which must not be neccessarily be a form-element.
    * So before a call to "isValid()" is about to be made, this implementation
    * checks first if the specific item sitting in this component has a method "isValid" - if it
    * does not exists, it will be added on the fly.
    */
    bindHandler: function () {

        Ext.each(this.form.items, function (f) {
            if (!f.isValid) {
                f.isValid = Ext.emptyFn;
            }
        });
    },

    /*
    * Listen for validity change on the entire form and update the combined error icon
    */
    listeners: {
        fieldvaliditychange: function (form, field, isValid) {
            this.updateErrorState(field);
            field.focus();
        }

    },

    updateErrorState: function () {
        var me = this,
            errorCmp,
            fields,
            errors;

        if (me.getForm().isDirty()) { //prevents showing global error when form first loads
            errorCmp = me.down('component[errorpanel]');

            fields = me.getForm().getFields();
            errors = [];
            fields.each(function (field) {
                Ext.Array.each(field.getErrors(), function (error) {
                    errors.push({ name: field.getFieldLabel(), error: error });
                });
            });
            errorCmp.setErrors(errors);
        }

    },

    /**
    * Overrides parent implementation. This is needed because in case
    * this method uses "monitorValid=true", the method "startMonitoring" must
    * not be called, until the "show"-event of this card fires.
    */
    initEvents: function () {
        var me = this,
            old = me.monitorValid;

        me.monitorValid = false;
        me.callParent();
        me.monitorValid = old;

        //me.on('beforehide', me.bubbleBeforeHideEvent, me); //Bubbling event not working correct

        me.enableBubble('beforecardhide'); //Attempt to fix event bubble issues

        me.on('beforecardhide', me.isValid, me);
        me.on('show', me.onCardShow, me);
        me.on('hide', me.onCardHide, me);
    },

    // -------- listener
    /**
    * Checks wether the beforecardhide-event may be triggered.
    */
    bubbleBeforeHideEvent: function () {
        var me = this,
            ly = me.ownerCt.layout,
            activeItem = ly.activeItem;

        if (activeItem && activeItem.id === me.id) {
            return me.fireEvent('beforecardhide', me);
        }
        return true;
    },

    /**
    * Stops monitoring the form elements in this component when the
    * 'hide'-event gets fired.
    */
    onCardHide: function () {
        var me = this;
        if (me.monitorValid) {
            me.stopMonitoring();
        }
    },

    /**
    * Starts monitoring the form elements in this component when the
    * 'show'-event gets fired.
    */
    onCardShow: function () {
        var me = this;
        if (me.monitorValid) {
            me.startMonitoring();
        }
    },

    /**
    * startMonitoring he form elements
    *
    */
    startMonitoring: function () {
        this.startPolling();
    },

    /**
    * startMonitoring he form elements
    *
    */
    stopMonitoring: function () {
        this.stopPolling();
    }

});