# Wheel Counter

Odoo 13 addon that adds the `wheel_counter` widget for integer fields.

## Features

- Scroll the mouse wheel over an integer field to increase or decrease it by 1.
- Scroll up to increment and scroll down to decrement.
- Use the up/down arrow controls displayed at the right end of the field.
- Keeps normal keyboard entry and Odoo integer validation available.
- Supports the signed 32-bit integer range used by Odoo integer fields.

## Installation

1. Copy or keep this addon in the Odoo 13 `addons_path`, for example `extra_addons`.
2. Restart Odoo.
3. Activate developer mode and update the Apps list.
4. Install **Wheel Counter**.
5. Upgrade the module or refresh assets with `Ctrl+F5` after changing frontend files.

## Usage

Add the widget to any integer field in an XML view:

```xml
<field name="quantity" widget="wheel_counter"/>
```

The controls are active in edit mode. Readonly views remain normal integer fields.
