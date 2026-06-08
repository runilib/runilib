'use client';

import { useEffect, useMemo, useRef } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styled from 'styled-components';

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

  const form = useFormBridge(schema, {
    initialValues: { version: defaultVersion },
  });

  const versionField = form.field('version');
  const liveValues = form.watchAll();
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
      <Select
        aria-label="Version"
        disabled={versionField.disabled}
        onBlur={versionField.onBlur}
        onChange={(event) => versionField.onChange(event.target.value)}
        value={selectedVersion || defaultVersion}
      >
        {versions.map((version, index) => (
          <option
            key={version}
            value={version}
          >
            {index === 0 ? `${version} (latest)` : version}
          </option>
        ))}
      </Select>
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

const Select = styled.select`
  min-width: 120px;
  padding: 6px 26px 6px 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  font-family: 'DM Mono', monospace;
  font-size: 11.5px;
  color: ${({ theme }) => theme.textPrimary};
  background-color: ${({ theme }) => theme.bgSurface};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  cursor: pointer;
  appearance: none;
`;
