// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Input } from '../Input';
import { Label, type LabelProps } from '../Label';

import type { Meta, StoryObj } from '@storybook/react';

export default {
    component: Label,
} as Meta;

export const LabelDefault: StoryObj<LabelProps> = {
    render: (props) => <Label {...props} />,
    args: { label: 'Test Label' },
};

export const LabelWithInput: StoryObj<LabelProps> = {
    ...LabelDefault,
    args: {
        label: 'Label with button',
        children: <Input />,
    },
};

export const LabelWithInputIndentationMd: StoryObj<LabelProps> = {
    ...LabelDefault,
    args: {
        label: 'Label with button',
        children: <Input />,
        indentation: 'md',
    },
};
