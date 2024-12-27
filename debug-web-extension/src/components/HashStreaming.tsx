import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopMode } from './streaming/PopMode';
import { FullMode } from './streaming/FullMode';
import { SecretMode } from './streaming/SecretMode';

export const HashStreaming: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stream Hashes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pop" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pop">Pop Mode</TabsTrigger>
            <TabsTrigger value="full">Full Mode</TabsTrigger>
            <TabsTrigger value="secret">Secret Mode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pop">
            <PopMode />
          </TabsContent>
          
          <TabsContent value="full">
            <FullMode />
          </TabsContent>
          
          <TabsContent value="secret">
            <SecretMode />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HashStreaming;