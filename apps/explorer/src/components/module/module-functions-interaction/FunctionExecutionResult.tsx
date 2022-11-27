// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { getExecutionStatusError, getTransactionDigest } from '@mysten/sui.js';

import { useTxEffectsObjectRefs } from './useTxEffectsObjectRefs';

import type { SuiTransactionResponse } from '@mysten/sui.js';

import Longtext from '~/components/longtext/Longtext';
import { Banner } from '~/ui/Banner';

type FunctionExecutionResultProps = {
    result: SuiTransactionResponse | null;
    error: string | false;
    onClear: () => void;
};

export function FunctionExecutionResult({
    error,
    result,
    onClear,
}: FunctionExecutionResultProps) {
    const adjError =
        error || (result && getExecutionStatusError(result)) || null;
    const icon = adjError ? undefined : null;
    const variant = adjError ? 'error' : 'message';
    const createdObjs = useTxEffectsObjectRefs(result, 'created');
    const mutatedObjs = useTxEffectsObjectRefs(result, 'mutated');
    const labelWithLinks = result
        ? [
              {
                  title: 'Transaction ID',
                  links: [
                      {
                          txt: getTransactionDigest(result),
                          category: 'transactions',
                      },
                  ],
              },
              createdObjs.length && { title: 'Created', links: createdObjs },
              mutatedObjs.length && { title: 'Updated', links: mutatedObjs },
          ].filter(Boolean)
        : [];
    return (
        <Banner
            icon={icon}
            fullWidth
            variant={variant}
            spacing="lg"
            onDismiss={onClear}
        >
            {adjError ? (
                adjError
            ) : (
                <div className="space-y-4 text-bodySmall">
                    {labelWithLinks.map((groupLinks) => {
                        if (!groupLinks) {
                            return null;
                        }
                        return (
                            <div className="space-y-3" key={groupLinks.title}>
                                {groupLinks.title ? (
                                    <div className="font-semibold text-gray-90">
                                        {groupLinks.title}
                                    </div>
                                ) : null}
                                {groupLinks.links
                                    ? groupLinks.links.map((aLink) => {
                                          const txt =
                                              'txt' in aLink
                                                  ? aLink.txt
                                                  : aLink.objectId;
                                          return (
                                              <div
                                                  className="font-medium font-mono"
                                                  key={txt}
                                              >
                                                  <Longtext
                                                      text={txt}
                                                      category={
                                                          'category' in aLink
                                                              ? (aLink.category as any)
                                                              : 'objects'
                                                      }
                                                      isLink
                                                  />
                                              </div>
                                          );
                                      })
                                    : null}
                            </div>
                        );
                    })}
                </div>
            )}
        </Banner>
    );
}
