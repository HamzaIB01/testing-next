import { useState, ReactNode, createContext } from "react";
type TabbarContext = {
  tabNumber: any;
  changeTab: (e: any) => void;
};

export const TabbarContext = createContext<TabbarContext>({} as TabbarContext);

type Props = {
  children: ReactNode;
};

export function TabbarProvider({ children }: Props) {
  const [tabNumber, setTabNumber] = useState(null);
  const changeTab = (e: any) => {
    setTabNumber(e);
  };

  return (
    <TabbarContext.Provider value={{ tabNumber, changeTab }}>
      {children}
    </TabbarContext.Provider>
  );
}
