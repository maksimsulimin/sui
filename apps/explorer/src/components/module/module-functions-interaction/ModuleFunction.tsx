// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
    getExecutionStatusType,
    getExecutionStatusError,
} from '@mysten/sui.js';
import { useWallet } from '@mysten/wallet-adapter-react';
import { WalletWrapper } from '@mysten/wallet-adapter-react-ui';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { FunctionExecutionResult } from './FunctionExecutionResult';
import { useFunctionParamsDetails } from './useFunctionParamsDetails';

import type { SuiMoveNormalizedFunction, ObjectId } from '@mysten/sui.js';

import { useZodForm } from '~/hooks/useZodForm';
import { Button } from '~/ui/Button';
import { DisclosureBox } from '~/ui/DisclosureBox';
import { Input } from '~/ui/Input';
import { Label } from '~/ui/Label';

const argsSchema = z.object({
    params: z.array(z.object({ value: z.string().trim().min(1) })),
});

export type ModuleFunctionProps = {
    packageId: ObjectId;
    moduleName: string;
    functionName: string;
    functionDetails: SuiMoveNormalizedFunction;
    defaultOpen?: boolean;
};

export function ModuleFunction({
    defaultOpen,
    packageId,
    moduleName,
    functionName,
    functionDetails,
}: ModuleFunctionProps) {
    const { connected, signAndExecuteTransaction } = useWallet();
    const paramsDetails = useFunctionParamsDetails(functionDetails.parameters);
    const {
        handleSubmit,
        formState,
        register,
        control,
        reset: formReset,
    } = useZodForm({
        schema: argsSchema,
    });
    const {
        mutateAsync: executeFunctionMutation,
        error,
        data: txResult,
        reset: executeFunctionReset,
    } = useMutation({
        mutationFn: async (params: string[]) => {
            const result = await signAndExecuteTransaction({
                kind: 'moveCall',
                data: {
                    packageObjectId: packageId,
                    module: moduleName,
                    function: functionName,
                    arguments: params,
                    typeArguments: [], // TODO: currently move calls that expect type argument will fail
                    gasBudget: 2000,
                },
            });
            if (getExecutionStatusType(result) === 'failure') {
                throw new Error(
                    getExecutionStatusError(result) || 'Transaction failed'
                );
            }
            return result;
        },
    });
    const executeFunctionError = error ? (error as Error).message : false;
    const allValues = useWatch({ control });
    useEffect(() => {
        executeFunctionReset();
    }, [allValues, executeFunctionReset]);
    const isExecuteDisabled =
        formState.isValidating ||
        !formState.isValid ||
        formState.isSubmitting ||
        !connected;
    return (
        <DisclosureBox defaultOpen={defaultOpen} title={functionName}>
            <form
                onSubmit={handleSubmit(({ params }) =>
                    toast
                        .promise(
                            executeFunctionMutation(
                                params.map(({ value }) => value)
                            ),
                            {
                                loading: 'Executing...',
                                error: () => 'Transaction failed',
                                success: 'Done',
                            }
                        )
                        .catch((e) => null)
                )}
                autoComplete="off"
                className="flex flex-col flex-nowrap items-stretch gap-4"
            >
                {paramsDetails.map(({ paramTypeText }, index) => {
                    const paramName = `params.${index}.value` as const;
                    const paramKey = [
                        packageId,
                        moduleName,
                        functionName,
                        paramName,
                    ].join('::');
                    return (
                        <Label
                            key={paramKey}
                            label={`Arg${index}`}
                            indentation="md"
                        >
                            <Input
                                {...register(paramName)}
                                placeholder={paramTypeText}
                            />
                        </Label>
                    );
                })}
                <div className="flex items-center justify-end gap-1.5">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isExecuteDisabled}
                    >
                        Execute
                    </Button>
                    <div className={clsx('temp-ui-override', { connected })}>
                        <WalletWrapper />
                    </div>
                </div>
                {error || txResult ? (
                    <FunctionExecutionResult
                        error={executeFunctionError}
                        result={txResult || null}
                        onClear={() => {
                            executeFunctionReset();
                            formReset();
                        }}
                    />
                ) : null}
            </form>
        </DisclosureBox>
    );
}
