'use client';

import { useEffect, useMemo, useRef } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styled, { useTheme } from 'styled-components';
import type { AppTheme } from '../types';

type VersionSelectorProps = Readonly<{
  versions: string[];
  defaultVersion: string;
  onChange: (version: string) => void;
}>;

export function VersionSelector({
  versions,
  defaultVersion,
  onChange,
}: VersionSelectorProps) {
  const theme = useTheme() as AppTheme;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const schema = useMemo(
    () => ({
      version: field.select().options(
        versions.map((v, i) => ({
          label: i === 0 ? `${v} (latest)` : v,
          value: v,
        })),
      ),
    }),
    [versions],
  );

  const { fields, watchAll } = useFormBridge(schema, {
    initialValues: { version: defaultVersion },
  });

  const liveValues = watchAll();
  const selectedVersion =
    typeof liveValues.version === 'string'
      ? liveValues.version
      : liveValues.version != null
        ? String(liveValues.version)
        : '';

  useEffect(() => {
    if (selectedVersion && selectedVersion !== defaultVersion) {
      onChangeRef.current(selectedVersion);
    }
  }, [selectedVersion, defaultVersion]);

  return (
    <Wrap>
      <Label>version</Label>
      <fields.version
        placeholder={selectedVersion || defaultVersion}
        {...{
          hideLabel: true,
          styles: {
            root: { gap: 0 },
            select: {
              fontFamily: "'DM Mono', monospace",
              fontSize: '11.5px',
              padding: '6px 10px',
              borderRadius: '4px',
              border: `1px solid ${theme.border}`,
              // color: "black",
              cursor: 'pointer',
              appearance: 'none' as const,
              WebkitAppearance: 'none' as const,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              paddingRight: '26px',
              minWidth: '120px',
            },
          },
        }}
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;
