odoo.define('wheel_counter.field_integer_wheel_counter', function (require) {
    'use strict';

    var basicFields = require('web.basic_fields');
    var fieldUtils = require('web.field_utils');
    var fieldRegistry = require('web.field_registry');

    var FieldInteger = basicFields.FieldInteger;

    var FieldIntegerWheelCounter = FieldInteger.extend({
        description: 'Integer with mouse-wheel counter controls',
        className: 'o_field_integer o_field_number o_wheel_counter',
        supportedFieldTypes: ['integer'],

        // InputField changes its root tag to <input> in edit mode. We need a
        // wrapper around that input so the arrow controls can sit at the right.
        init: function () {
            this._super.apply(this, arguments);
            if (this.mode === 'edit') {
                this.tagName = 'span';
            }
        },

        events: _.extend({}, FieldInteger.prototype.events, {
            'wheel': '_onWheel',
            'click .o_wheel_counter_button': '_onCounterButtonClick',
            'mousedown .o_wheel_counter_button': '_onCounterButtonMouseDown',
        }),

        _renderEdit: function () {
            // Prepare a fresh input instead of using the wrapper as the input.
            // This also keeps rerendering idempotent after an onchange/reset.
            var $input = this._prepareInput();
            var $wrapper = $('<span/>', {
                'class': 'o_wheel_counter_input_wrapper',
            });
            var $controls = $('<span/>', {
                'class': 'o_wheel_counter_controls',
                'role': 'group',
                'aria-label': 'Change value',
            });
            var $increment = $('<button/>', {
                'type': 'button',
                'class': 'o_wheel_counter_button o_wheel_counter_increment',
                'title': 'Increase by 1',
                'aria-label': 'Increase by 1',
                'tabindex': '-1',
                'html': '&#9650;',
            });
            var $decrement = $('<button/>', {
                'type': 'button',
                'class': 'o_wheel_counter_button o_wheel_counter_decrement',
                'title': 'Decrease by 1',
                'aria-label': 'Decrease by 1',
                'tabindex': '-1',
                'html': '&#9660;',
            });

            $controls.append($increment, $decrement);
            $wrapper.append($input, $controls);
            this._replaceElement($wrapper);
            this.$input = $input;
        },

        _getCounterValue: function () {
            var rawValue = this.$input && this.$input.val();
            if (rawValue === '' || rawValue === null || rawValue === undefined) {
                return 0;
            }
            try {
                return fieldUtils.parse.integer(rawValue);
            } catch (error) {
                var fallback = Number(this.value);
                return isNaN(fallback) ? 0 : fallback;
            }
        },

        _changeCounterValue: function (delta) {
            if (this.mode !== 'edit' || !this.$input || !this.$input.length) {
                return;
            }

            var nextValue = this._getCounterValue() + delta;
            // Odoo integer fields use a signed 32-bit integer range.
            nextValue = Math.max(-2147483648, Math.min(2147483647, nextValue));
            var self = this;
            this._wheelChangeSequence = (this._wheelChangeSequence || 0) + 1;
            var changeSequence = this._wheelChangeSequence;

            // Update immediately so fast wheel events are visible without
            // waiting for the model round-trip. _setValue still performs the
            // normal Odoo validation and field_changed notification.
            this.$input.val(String(nextValue));
            this.isDirty = true;
            this._isDirty = true;
            this._setValue(String(nextValue)).then(function () {
                // Odoo 13 does not necessarily rerender an input after the
                // field_changed promise resolves, so keep the display synced.
                // Only the latest wheel event may repaint the input.
                if (changeSequence === self._wheelChangeSequence) {
                    self.value = nextValue;
                    if (self.$input && self.$input.length) {
                        self.$input.val(String(nextValue));
                    }
                }
            }).catch(function () {
                // A rejected field change is already handled by Odoo. Do not
                // leave an unhandled promise when a view rejects the update.
            });
        },

        _onWheel: function (event) {
            if (this.mode !== 'edit') {
                return;
            }

            var originalEvent = event.originalEvent || event;
            var deltaY = originalEvent.deltaY;
            if (deltaY === undefined && originalEvent.wheelDelta !== undefined) {
                deltaY = -originalEvent.wheelDelta;
            }
            if (!deltaY) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            this._changeCounterValue(deltaY < 0 ? 1 : -1);
        },

        _onCounterButtonClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var $button = $(event.currentTarget);
            this._changeCounterValue(
                $button.hasClass('o_wheel_counter_increment') ? 1 : -1
            );
        },

        _onCounterButtonMouseDown: function (event) {
            // Keep the input focused while clicking the arrow rail.
            event.preventDefault();
            event.stopPropagation();
        },
    });

    fieldRegistry.add('wheel_counter', FieldIntegerWheelCounter);

    return FieldIntegerWheelCounter;
});
