# -*- coding: utf-8 -*-
{
    'name': 'Wheel Counter',
    'summary': 'Increment integer fields with the mouse wheel and arrow controls.',
    'description': """
        Adds the wheel_counter widget for Odoo integer fields. In edit mode,
        scrolling over the field changes its value by one and compact up/down
        buttons are displayed at the right side of the input.
    """,
    'version': '13.0.1.0.0',
    'category': 'Tools',
    'author': 'Sarang T',
    'license': 'LGPL-3',
    'images': ['static/description/icon.png'],
    'depends': ['web'],
    'data': [
        'views/assets.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
