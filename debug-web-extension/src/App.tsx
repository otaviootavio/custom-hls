import { useState } from 'react';
import { useHashChainFromExtension } from './context/HashChainExtensionProvider';

interface ResponseState {
  [key: string]: string;
}

const App = () => {
  const {
    hashChainElements,
    tail,
    fullHashChain,
    secret,
    length,
    lastHashSendIndex,
    fetchAndPopHashFromHashChain,
    fetchTail,
    fetchHashChain,
    fetchSecretAndLength,
    openChannel,
    fetchSmartContractAddress,
    fetchChainId,
    fetchToAddress,
    fetchAmount,
    userExportHashChainToExtension
  } = useHashChainFromExtension();

  const [responses, setResponses] = useState<ResponseState>({});

  const handleFetch = async (key: string, fetchFn: () => Promise<unknown>) => {
    try {
      const result = await fetchFn();
      setResponses({ [key]: JSON.stringify(result, null, 2) });
    } catch (error) {
      setResponses({ [key]: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleOpenChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const result = await openChannel(
        String(formData.get('contractAddress')),
        String(formData.get('toAddress')),
        String(formData.get('amount')),
        String(formData.get('key')),
        Number(formData.get('chainId'))
      );
      setResponses({ openChannel: JSON.stringify(result, null, 2) });
    } catch (error) {
      setResponses({ openChannel: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleExportHashChain = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const result = await userExportHashChainToExtension(
        String(formData.get('lastHashExpended')) as `0x${string}`,
        Number(formData.get('indexOfLastHashExended')),
        Number(formData.get('hashChainLength')),
        Number(formData.get('chainId')),
        String(formData.get('smartContractAddress')) as `0x${string}`,
        String(formData.get('tail')) as `0x${string}`
      );
      setResponses({ exportHashChain: JSON.stringify(result, null, 2) });
    } catch (error) {
      setResponses({ exportHashChain: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Hash Chain Debugger</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current State</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify({
          hashChainElements,
          tail,
          fullHashChainLength: fullHashChain.length,
          secret,
          length,
          lastHashSendIndex
        }, null, 2)}</pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic Operations</h2>
        <div className="space-x-2">
          <button 
            onClick={() => handleFetch('fetchAndPopHash', fetchAndPopHashFromHashChain)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch and Pop Hash
          </button>
          <button 
            onClick={() => handleFetch('fetchTail', fetchTail)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Tail
          </button>
          <button 
            onClick={() => handleFetch('fetchHashChain', fetchHashChain)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Hash Chain
          </button>
          <button 
            onClick={() => handleFetch('fetchSecretAndLength', fetchSecretAndLength)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Secret and Length
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Open Channel</h2>
        <form onSubmit={handleOpenChannel} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              name="contractAddress" 
              placeholder="Contract Address" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="toAddress" 
              placeholder="To Address" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="amount" 
              placeholder="Amount (ETH)" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="key" 
              placeholder="Key" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="chainId" 
              placeholder="Chain ID" 
              type="number" 
              className="border p-2 rounded w-full"
            />
          </div>
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Open Channel
          </button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Export Hash Chain</h2>
        <form onSubmit={handleExportHashChain} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              name="lastHashExpended" 
              placeholder="Last Hash Expended" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="indexOfLastHashExended" 
              placeholder="Index of Last Hash Expended" 
              type="number" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="hashChainLength" 
              placeholder="Hash Chain Length" 
              type="number" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="chainId" 
              placeholder="Chain ID" 
              type="number" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="smartContractAddress" 
              placeholder="Smart Contract Address" 
              className="border p-2 rounded w-full"
            />
            <input 
              name="tail" 
              placeholder="Tail" 
              className="border p-2 rounded w-full"
            />
          </div>
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export Hash Chain
          </button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Fetch Information</h2>
        <div className="space-x-2">
          <button 
            onClick={() => handleFetch('fetchSmartContractAddress', fetchSmartContractAddress)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Smart Contract Address
          </button>
          <button 
            onClick={() => handleFetch('fetchChainId', fetchChainId)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Chain ID
          </button>
          <button 
            onClick={() => handleFetch('fetchToAddress', fetchToAddress)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch To Address
          </button>
          <button 
            onClick={() => handleFetch('fetchAmount', fetchAmount)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Amount
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Responses</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(responses, null, 2)}</pre>
      </section>
    </div>
  );
};

export default App;