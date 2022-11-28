// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';

import type { ComponentProps } from 'react';

export interface InputProps
    extends Omit<ComponentProps<'input'>, 'ref' | 'className'> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ ...inputProps }, ref) => {
        return (
            <input
                ref={ref}
                {...inputProps}
                className="p-2 text-steel-darker text-body font-medium bg-white border-gray-45 border border-solid rounded-md shadow-sm shadow-ebony/10 placeholder:text-gray-60"
            />
        );
    }
);
