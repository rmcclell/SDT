/**
* Licensed under GNU LESSER GENERAL PUBLIC LICENSE Version 3
*
* @author Thorsten Suckow-Homberg <ts@siteartwork.de>
* @url http://www.siteartwork.de/wizardcomponent
*/

/**
* @class Ext.ux.Wiz.Header
* @extends Ext.BoxComponent
*
* A specific {@link Ext.BoxComponent} that can be used to show the current process in an
* {@link Ext.ux.Wiz}.
*
* An instance of this class is usually being created by {@link Ext.ux.Wiz#initPanels} using the
* {@link Ext.ux.Wiz#headerConfig}-object.
*
* @private
* @constructor
* @param {Object} config The config object
*/
Ext.define('Ext.ux.panel.Header', {
    extend: 'Ext.Component',
    alias: 'widget.wizardheader',

    /**
    * @cfg {Number} height The height of this component. Defaults to "55".
    */
    height: 25,

    /**
    * @cfg {String} region The Region of this component. Since a {@link Ext.ux.Wiz}
    * usually uses a {@link Ext.layout.BorderLayout}, this property defaults to
    * "north". If you want to change this property, you should also change the appropriate
    * css-classes that are used for this component.
    */
    region: 'north',

    /**
    * @cfg {String} title The title that gets rendered in the head of the component. This
    * should be a text describing the purpose of the wizard.
    */
    title: 'Wizard',

    /**
    * @cfg {Number} steps The overall number of steps the user has to go through
    * to finish the wizard.
    */
    steps: 0,

    /**
    * @cfg {String} stepText The text in the header indicating the current process in the wizard.
    * (defaults to "Step {0} of {1}: {2}").
    * {0} is replaced with the index (+1) of the current card, {1} is replaced by the
    * total number of cards in the wizard and {2} is replaced with the title-property of the
    * {@link Ext.ux.Wiz.Card}
    * @type String
    */
    stepText: "Step {0} of {1}: {2}",

    /**
    * @cfg {Object} autoEl The element markup used to render this component.
    */

    margin: 5,

    autoEl: {
        tag: 'div',
        cls: 'ext-ux-wiz-Header',
        children: [{
            tag: 'div',
            cls: 'ext-ux-wiz-Header-title'
        }, {
            tag: 'div',
            children: [{
                tag: 'div',
                cls: 'ext-ux-wiz-Header-step'
            }, {
                tag: 'div',
                cls: 'ext-ux-wiz-Header-stepIndicator-container'
            }]
        }]
    },

    /**
    * @param {Ext.Element}
    */
    titleEl: null,

    /**
    * @param {Ext.Element}
    */
    stepEl: null,

    /**
    * @param {Ext.Element}
    */
    imageContainer: null,

    /**
    * @param {Array}
    */
    indicators: null,

    /**
    * @param {Ext.Template}
    */
    stepTemplate: null,

    /**
    * @param {Number} lastActiveStep Stores the index of the last active card that
    * was shown-
    */
    lastActiveStep: -1,

    // -------- helper
    /**
    * Gets called by {@link Ext.ux.Wiz#onCardShow()} and updates the header
    * with the approppriate information, such as the progress of the wizard
    * (i.e. which card is being shown etc.)
    *
    * @param {Number} currentStep The index of the card currently shown in
    * the wizard
    * @param {String} title The title-property of the {@link Ext.ux.Wiz.Card}
    *
    * @private
    */
    updateStep: function (currentStep, title) {
        var me = this,
            html = me.stepTemplate.apply([currentStep + 1, me.steps, title]);

        me.update(html);
        me.lastActiveStep = currentStep;
    },


    // -------- listener
    /**
    * Overrides parent implementation to initComponent this component properly.
    */
    initComponent: function () {
        var me = this;
        me.autoEl.cls = me.autoEl.cls + ' ' + me.cls;
        me.callParent(arguments);

    },

    /**
    * Overrides parent implementation to render this component properly.
    */

    onRender: function (ct, position) {
        var me = this, html;
        me.stepTemplate = Ext.create('Ext.XTemplate', me.stepText);

        html = me.stepTemplate.apply([1, me.steps, me.up('wizard').cards[me.up('wizard').currentCard].title]);

        me.callParent(arguments);
        me.update(html);
    }
});