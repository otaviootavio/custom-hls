import { z } from "zod";
import { VendorDataSchema } from "../../clients/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Vendor = z.infer<typeof VendorDataSchema>;

interface VendorInfoProps {
  vendor: Vendor;
}

export const VendorInfo: React.FC<VendorInfoProps> = ({ vendor }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Vendor Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Chain ID</div>
          <div className="font-mono text-sm">{vendor.chainId}</div>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Vendor Address
          </div>
          <div className="font-mono text-sm break-all">{vendor.address}</div>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Amount per Hash
          </div>
          <div className="font-mono text-sm">{vendor.amountPerHash} ETH</div>
        </div>
      </CardContent>
    </Card>
  );
};
