'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

export default function NotFound() {
  const { t } = useApp();
  return (
    <NotFoundWrap>
      <NFCode>404</NFCode>
      <NFTitle>{t.notFound.title}</NFTitle>
      <NFSub>{t.notFound.sub}</NFSub>
      <NFBtn href="/">{t.notFound.back}</NFBtn>
    </NotFoundWrap>
  );
}

const NotFoundWrap = styled.div`
  padding-top: 64px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
`;
const NFCode = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 120px;
  font-weight: 500;
  color: ${({ theme }) => theme.teal};
  opacity: 0.12;
  line-height: 1;
  margin-bottom: 24px;
`;
const NFTitle = styled.h1`
  font-family: 'Sora', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 12px;
`;
const NFSub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 32px;
`;
const NFBtn = styled(Link)`
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
  padding: 12px 24px; border-radius: 10px; text-decoration: none;
  background: ${({ theme }) => theme.teal}; color: #080a0e;
  &:hover { opacity: 0.9; }
`;
