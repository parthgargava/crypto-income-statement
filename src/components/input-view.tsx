"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wallet } from "lucide-react";
import { CryptoIcon } from "./icons/crypto-icons";
import { Logo } from "./logo";

interface InputViewProps {
  onProcess: () => void;
}

export function InputView({ onProcess }: InputViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Logo />
        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Crypto Income Verification Made Simple
        </h2>
        <p className="mt-2 max-w-2xl text-center text-lg text-muted-foreground">
            Upload your exchange statements or connect a wallet to generate a verifiable income report in minutes.
        </p>
        
        <Card className="mt-8 w-full max-w-2xl shadow-lg">
            <CardContent className="p-6">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/> Upload Statement</TabsTrigger>
                        <TabsTrigger value="wallet"><Wallet className="mr-2 h-4 w-4"/> Enter Wallet</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-6">
                        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-10 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <p className="font-medium">Drag & drop your PDF/CSV file here</p>
                            <p className="text-sm text-muted-foreground">or</p>
                            <Button size="sm" onClick={onProcess}>Browse Files</Button>
                            <p className="text-xs text-muted-foreground mt-2">Demonstration: Click any button to use mock data.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="wallet" className="mt-6">
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="wallet-address" className="block text-sm font-medium text-foreground mb-1">
                                    Public Wallet Address
                                </label>
                                <div className="relative">
                                    <Input id="wallet-address" type="text" placeholder="0x... or btc..."/>
                                    <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                                        <CryptoIcon currency="BTC" className="h-5 w-5 animate-spin [animation-duration:5s]" />
                                        <CryptoIcon currency="ETH" className="h-5 w-5 animate-spin [animation-duration:3s]" />
                                    </div>
                                </div>
                             </div>
                            <Button className="w-full" onClick={onProcess}>
                                Fetch Transactions
                            </Button>
                             <p className="text-xs text-muted-foreground text-center">Demonstration: Click button to use mock data.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
