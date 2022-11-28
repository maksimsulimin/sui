// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { getNormalizedFunctionParameterTypeDetails } from '../utils';

import type { SuiMoveNormalizedType } from '@mysten/sui.js';

export function useFunctionParamsDetails(
    params: SuiMoveNormalizedType[],
    options?: { filterOutTxContext: boolean },
    functionTypeArgNames?: string[]
) {
    const { filterOutTxContext = true } = options || {};
    return useMemo(() => {
        let paramDetails = params.map((aParam) =>
            getNormalizedFunctionParameterTypeDetails(
                aParam,
                functionTypeArgNames
            )
        );
        if (filterOutTxContext) {
            paramDetails = paramDetails.filter(
                ({ isTxContext }) => !isTxContext
            );
        }
        return paramDetails;
    }, [params, functionTypeArgNames, filterOutTxContext]);
}
