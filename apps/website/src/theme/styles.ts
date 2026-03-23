import { createGlobalStyle,  } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background:  ${({ theme }) => theme.bg};
    color:       ${({ theme }) => theme.textPrimary};
    font-family: 'Sora', sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background 0.25s, color 0.25s;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar             { width: 5px; }
  ::-webkit-scrollbar-track       { background: ${({ theme }) => theme.bg}; }
  ::-webkit-scrollbar-thumb       { background: ${({ theme }) => theme.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => theme.teal}55; }

  ::selection {
    background: ${({ theme }) => theme.teal}28;
    color: ${({ theme }) => theme.textPrimary};
  }

  button { font-family: inherit; }
  img    { max-width: 100%; }
`;




