// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import type { ComponentProps, ReactNode } from 'react';

const labelStyles = cva('text-bodySmall font-medium text-steel-darker', {
    variants: {
        indentation: {
            md: 'ml-2.5',
        },
    },
});

export interface LabelProps
    extends Omit<ComponentProps<'label'>, 'ref' | 'className'>,
        VariantProps<typeof labelStyles> {
    label: ReactNode;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ label, children, indentation, ...labelProps }, ref) => {
        return (
            <label
                ref={ref}
                {...labelProps}
                className="flex flex-col flex-nowrap items-stretch gap-2.5"
            >
                <div className={labelStyles({ indentation })}>{label}</div>
                {children ? (
                    <div className="flex flex-col flex-nowrap">{children}</div>
                ) : null}
            </label>
        );
    }
);
