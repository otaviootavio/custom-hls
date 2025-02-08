import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { AlertCircle, Loader2, Check } from "lucide-react";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "../ui/slider";
import { channelApi } from "@/clients/api";
import { useSmartContract } from "@/hooks/useSmartContract";
import { parseEther } from "viem";
import type { Abi } from "viem";

// Types
interface CompiledContract {
  abi: Abi;
  bytecode: string;
}

interface ConfirmHashesProps {
  isDisabled: boolean;
  numHashes: string;
  onConfirm: () => void;
  isConfirmed: boolean;
}

interface CompileContractProps {
  isDisabled: boolean;
  onCompileSuccess: (contract: CompiledContract) => void;
  isHashesConfirmed: boolean;
}

interface DeployContractProps {
  isDisabled: boolean;
  compiledContract: CompiledContract | null;
  numHashes: string;
  onDeploySuccess: (address: string) => void;
  isHashesConfirmed: boolean;
}

interface HashSliderProps {
  value: string;
  onChange: (values: number[]) => void;
  isDisabled: boolean;
  isConfirmed: boolean;
}interface CompiledContract {
  abi: Abi;
  bytecode: string;
}

interface ConfirmHashesProps {
  isDisabled: boolean;
  numHashes: string;
  totalAmount: string;
  onConfirm: () => void;
  isConfirmed: boolean;
  isConfirming: boolean;
}

// Confirm Hashes Component
const ConfirmHashes = ({ 
  isDisabled, 
  numHashes, 
  onConfirm, 
  isConfirmed,
  isConfirming 
}: ConfirmHashesProps) => {
  return (
    <Button 
      onClick={onConfirm}
      disabled={isDisabled || isConfirmed || !numHashes || isConfirming}
      className="flex-1"
      variant={isConfirmed ? "outline" : "default"}
    >
      {isConfirming ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Confirming...
        </>
      ) : isConfirmed ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Hashes Confirmed: {numHashes}
        </>
      ) : (
        "1. Confirm Hashes"
      )}
    </Button>
  );
};

// Compile Contract Component
const CompileContract = ({
  isDisabled,
  onCompileSuccess,
  isHashesConfirmed,
}: CompileContractProps) => {
  const { toast } = useToast();
  const { isCompiling, compileContract } = useSmartContract();

  const handleCompile = async () => {
    try {
      const { abi, bytecode } = await compileContract();
      onCompileSuccess({ abi, bytecode });
      toast({
        title: "Success",
        description: "Contract compiled successfully",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to compile contract";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleCompile}
      disabled={isDisabled || isCompiling || !isHashesConfirmed}
      className="flex-1"
    >
      {isCompiling ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Compiling...
        </>
      ) : (
        "2. Compile Contract"
      )}
    </Button>
  );
};

// Deploy Contract Component
const DeployContract = ({
  isDisabled,
  compiledContract,
  numHashes,
  onDeploySuccess,
  isHashesConfirmed,
}: DeployContractProps) => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);
  const { deployContract } = useSmartContract();
  const { selectedHashchain, updateContractDetails, getSelectedHashchain } =
    useHashchain();

  const handleDeploy = async () => {
    if (
      !selectedHashchain?.data?.vendorData ||
      !numHashes ||
      !compiledContract
    ) {
      toast({
        title: "Error",
        description: "Missing required data or contract not compiled",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);

    try {
      let hashchain = await getSelectedHashchain();
      if (!hashchain) throw new Error("No hashchain selected");

      const amountPerHash = hashchain.data.vendorData.amountPerHash;
      const totalAmount = parseFloat(numHashes) * parseFloat(amountPerHash);
      const amountInWei = parseEther(totalAmount.toString());

      const contractAddress = await deployContract({
        amountEthInWei: amountInWei,
        numersOfToken: parseInt(numHashes),
        toAddress: hashchain.data.vendorData.vendorAddress as `0x${string}`,
        tail: hashchain.data.tail,
        abi: compiledContract.abi,
        bytecode: compiledContract.bytecode,
      });

      const response = await channelApi.createChannel({
        contractAddress: contractAddress as `0x${string}`,
        numHashes: parseInt(numHashes),
        lastIndex: 0,
        lastHash:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        totalAmount,
        vendorId: import.meta.env.VITE_VENDOR_ID as string,
      });

      if (response.success) {
        await updateContractDetails({
          contractAddress: response.data.contractAddress,
          numHashes: response.data.numHashes.toString(),
          totalAmount: response.data.totalAmount.toString(),
        });

        onDeploySuccess(contractAddress);

        toast({
          title: "Success",
          description: "Channel opened successfully",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to open channel";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error opening channel:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Button
      onClick={handleDeploy}
      disabled={
        isDisabled || isDeploying || !compiledContract || !isHashesConfirmed
      }
      className="flex-1"
    >
      {isDeploying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deploying...
        </>
      ) : (
        "3. Deploy Contract"
      )}
    </Button>
  );
};

// Hash Slider Component
const HashSlider = ({
  value,
  onChange,
  isDisabled,
  isConfirmed,
}: HashSliderProps) => (
  <div>
    <Label htmlFor="numHashes" className="text-sm text-gray-500">
      Number of Hashes: {value}
    </Label>
    <Slider
      id="numHashes"
      min={100}
      max={1000}
      step={100}
      value={[parseInt(value) || 0]}
      onValueChange={onChange}
      disabled={isDisabled || isConfirmed}
    />
  </div>
);

// Main OpenChannel Component
export const OpenChannel = () => {
  const { toast } = useToast();
  const [numHashes, setNumHashes] = useState("");
  const [isHashesConfirmed, setIsHashesConfirmed] = useState(false);
  const [isConfirmingHashes, setIsConfirmingHashes] = useState(false);
  const [deployedContract, setDeployedContract] = useState("");
  const [compiledContract, setCompiledContract] = useState<CompiledContract | null>(null);
  const { selectedHashchain, error, updateContractDetails } = useHashchain();

  const handleNumHashesChange = (values: number[]) => {
    if (!isHashesConfirmed) {
      setNumHashes(values[0].toString());
    }
  };

  const handleConfirmHashes = async () => {
    if (!numHashes) {
      toast({
        title: "Error",
        description: "Please select the number of hashes",
        variant: "destructive",
      });
      return;
    }

    setIsConfirmingHashes(true);

    try {
      // Update the hashchain with the number of hashes
      await updateContractDetails({
        numHashes: numHashes,
        totalAmount: totalAmount,
      });

      setIsHashesConfirmed(true);
      toast({
        title: "Success",
        description: `Number of hashes confirmed: ${numHashes}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to confirm hashes";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsHashesConfirmed(false);
    } finally {
      setIsConfirmingHashes(false);
    }
  };

  const amountPerHash = selectedHashchain?.data.vendorData.amountPerHash ?? "0";
  const totalAmount = selectedHashchain?.data?.vendorData && numHashes
    ? (parseFloat(numHashes) * parseFloat(amountPerHash)).toFixed(6)
    : "0";

  const isDisabled = !selectedHashchain?.data?.vendorData?.chainId || 
    !!selectedHashchain.data.contractAddress;

  return (
    <Card className={isDisabled ? "opacity-25" : ""}>
      <CardHeader>
        <CardTitle>
          <p className="font-bold text-md">2. Open the channel!</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <HashSlider 
            value={numHashes}
            onChange={handleNumHashesChange}
            isDisabled={isDisabled}
            isConfirmed={isHashesConfirmed}
          />

          <div>
            <Label className="text-sm text-gray-500">
              Total Amount (ETH)
            </Label>
            <div className="flex flex-row items-center gap-2">
              <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
                {totalAmount} ETH
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <ConfirmHashes 
              isDisabled={isDisabled}
              numHashes={numHashes}
              totalAmount={totalAmount}
              onConfirm={handleConfirmHashes}
              isConfirmed={isHashesConfirmed}
              isConfirming={isConfirmingHashes}
            />

            <div className="flex flex-row gap-2">
              <CompileContract 
                isDisabled={isDisabled}
                onCompileSuccess={setCompiledContract}
                isHashesConfirmed={isHashesConfirmed}
              />

              <DeployContract 
                isDisabled={isDisabled}
                compiledContract={compiledContract}
                numHashes={numHashes}
                onDeploySuccess={setDeployedContract}
                isHashesConfirmed={isHashesConfirmed}
              />
            </div>
          </div>

          <p className="text-sm">
            You will be able to watch up to{" "}
            <span className="font-bold">
              {(parseFloat(numHashes) / 4 || 0).toFixed(0)} minutes
            </span>
          </p>
        </div>

        <div className="mt-4">
          {error && (
            <div className="text-sm text-red-500 mb-4">
              Error: {error.message}
            </div>
          )}

          {compiledContract && !deployedContract && (
            <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
              <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-sm">
                <p className="font-bold">Contract compiled successfully!</p>
                <p>You can now deploy the contract.</p>
              </div>
            </div>
          )}

          {deployedContract && (
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-sm space-y-1 w-full">
                <p className="font-bold">Channel opened successfully!</p>
                <p className="font-mono text-xs truncate">
                  Contract Address: {deployedContract}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


export default OpenChannel;
