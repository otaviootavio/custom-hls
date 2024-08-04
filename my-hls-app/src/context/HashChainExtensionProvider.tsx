import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";



interface HashChainContextType {
  hashChainElements: { data: string; index: number }[];
  h100: string;
  fullHashChain: string[];
  secret: string;
  length: number;
  fetchHashChain: () => void;
  sendH100Once: () => void;
  fetchFullHashChain: () => void;
  fetchSecretLength: () => void;
}

interface HashChainExtensionProviderProps {
  children: ReactNode;
}


const HashChainContext = createContext<HashChainContextType | undefined>(
  undefined
);

export const HashChainExtensionProvider: React.FC<
  HashChainExtensionProviderProps
> = ({ children }) => {
  const [hashChainElements, setHashChainElements] = useState<
    { data: string; index: number }[]
  >([]);
  const [h100, setH100] = useState<string>("");
  const[fullHashChain, setFullHashChain] = useState<string[]>([]);
  const[secret,setSecret] = useState<string>("");
  const[length,setLenght] = useState<number>(0);

  const handleResponse = (event: MessageEvent) => {
    if (event.data.type === "HashChain") {
      setHashChainElements((prev) => [
        ...prev,
        { data: event.data.data, index: event.data.index },
      ]);
    } else if (event.data.type === "Recover_h(100)") {
      setH100(event.data.data);
    } else if (event.data.type === "fullHashChain"){
      setFullHashChain(event.data.data);
    } else if (event.data.type === "SecretLenght"){
      setSecret(event.data.secret);
      setLenght(event.data.length);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleResponse);
    return () => window.removeEventListener("message", handleResponse);
  }, []);

  const fetchHashChain = () => {
    window.postMessage({ type: "RequestHashChain" }, "*");
  };

  const sendH100Once = () => {
    window.postMessage({ type: "Send_h(100)" }, "*");
  };

  const fetchFullHashChain = () => {
    window.postMessage({type: "RequestFullHashChain"}, "*");
  };

  const fetchSecretLength = () => {
    window.postMessage({type: "RequestSecretLength"}, "*");
  };

  return (
    <HashChainContext.Provider
      value={{ hashChainElements, h100, fullHashChain, secret, length, fetchHashChain, sendH100Once, fetchFullHashChain, fetchSecretLength}}
    >
      {children}
    </HashChainContext.Provider>
  );
};

export const useHashChainFromExtension = () => {
  const context = useContext(HashChainContext);
  if (context === undefined) {
    throw new Error(
      "useHashChain must be used within a HashChainExtensionProvider"
    );
  }
  return context;
};
