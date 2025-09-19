import ReactDOM from 'react-dom';
import * as React from 'react';

export const createPortal = (component: React.ReactElement) => {
  const portalRoot = document.getElementById('portal-root')!;
  return ReactDOM.createPortal(component, portalRoot);
};
