// NoFooterLayout.tsx

import { useLayoutContext } from '@/providers/LayoutContext';

const KioskLayout = ({ children }) => {
  const { header, footer } = useLayoutContext();

  return (
    <>
      {header}
      {children}
      {/* {footer} */}
    </>
  );
};

export default KioskLayout;
