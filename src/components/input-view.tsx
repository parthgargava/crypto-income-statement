"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wallet, ArrowRight, FileText, Calculator, TrendingUp } from "lucide-react";
import { CryptoIcon } from "./icons/crypto-icons";
import { Logo } from "./logo";
import { detectCryptoType } from "@/lib/utils";
import { FileUpload } from "./file-upload";

interface InputViewProps {
  onProcess: (walletAddress: string, cryptoType: string) => void;
  onPDFUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function InputView({ onProcess, onPDFUpload, isUploading, uploadProgress }: InputViewProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const [detectedCrypto, setDetectedCrypto] = useState<string | null>(null);

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setWalletAddress(address);
    
    if (address.trim()) {
      const cryptoType = detectCryptoType(address);
      setDetectedCrypto(cryptoType);
    } else {
      setDetectedCrypto(null);
    }
  };

  return (
    <div className="calico-container">
        <div className="text-center mb-8 calico-fade-in">
          <Logo />
          <h2 className="calico-heading mt-8 calico-fade-in-delayed">
              Get an income statement for your lender
          </h2>
          <p className="calico-subheading mt-5 max-w-2xl calico-fade-in-delayed-2">
              Provide value to your lender and financial planner
          </p>
          
          {/* Feature highlights with icons */}
          <div className="flex justify-center items-center gap-8 mt-8 calico-fade-in-delayed-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground calico-feature-highlight cursor-pointer">
              <FileText className="h-4 w-4 text-primary" />
              <span>PDF Statements</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground calico-feature-highlight cursor-pointer">
              <Calculator className="h-4 w-4 text-primary" />
              <span>Income Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground calico-feature-highlight cursor-pointer">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Portfolio Insights</span>
            </div>
          </div>
        </div>
        
        <Card className="calico-card w-full max-w-2xl calico-bounce-in">
            <CardContent className="p-8">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
                        <TabsTrigger value="upload" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground">
                          <Upload className="mr-2 h-4 w-4"/> Upload Statement
                        </TabsTrigger>
                        <TabsTrigger value="wallet" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground">
                          <Wallet className="mr-2 h-4 w-4"/> Enter Wallet
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-8">
                        <FileUpload 
                          onFileUpload={onPDFUpload}
                          onUploadComplete={() => {}}
                          isUploading={isUploading}
                          uploadProgress={uploadProgress}
                        />
                    </TabsContent>
                    <TabsContent value="wallet" className="mt-8">
                        <div className="space-y-6">
                             <div>
                                <label htmlFor="wallet-address" className="block text-sm font-medium text-foreground mb-2">
                                    Public Wallet Address
                                </label>
                                <div className="relative">
                                    <Input 
                                      id="wallet-address" 
                                      type="text" 
                                      placeholder="0x... or btc..."
                                      value={walletAddress}
                                      onChange={handleWalletAddressChange}
                                      className="bg-background border-border focus:border-primary"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center">
                                        {detectedCrypto ? (
                                            <span className="text-sm font-semibold text-primary animate-pulse">
                                                {detectedCrypto}
                                            </span>
                                        ) : walletAddress.trim() ? (
                                            <span className="text-sm text-muted-foreground animate-pulse">
                                                ...
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <span>BTC</span>
                                                <span>•</span>
                                                <span>ETH</span>
                                                <span>•</span>
                                                <span>SOL</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {detectedCrypto && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Detected: {detectedCrypto} wallet
                                    </p>
                                )}
                             </div>
                            <Button 
                                className="calico-button w-full" 
                                onClick={() => onProcess(walletAddress, detectedCrypto || "")}
                                disabled={!walletAddress.trim() || !detectedCrypto}
                            >
                                Fetch Transactions
                                <ArrowRight className="ml-2 h-4 w-4" />
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
