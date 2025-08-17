// A component to render crypto icons based on currency symbol
import { DollarSign } from 'lucide-react';

// Using inline SVGs for better performance and customization
const BtcIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#F7931A"/>
    <path d="M14.22 14.78h-4.44c-.35 0-.63-.28-.63-.63v-4.3c0-.35.28-.63.63-.63h4.44c.35 0 .63.28.63.63v4.3c0 .35-.28.63-.63.63zm-3.81-1.26h3.18V10.3H10.41v3.22zM15.5 12.5v-1h.75v-1h-.75v-1h.75v-1h-.75v-.75h-1.5v.75h-4v-.75h-1.5v.75H8.5v1H7.75v1H8.5v1H7.75v1H8.5v.75h1.5v-.75h4v.75h1.5V12.5z" fill="white"/>
  </svg>
);

const EthIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#627EEA"/>
    <path d="m12 4.01-6 6 6 2 6-2-6-6zm0 8.5L6 18l6-4.5 6 4.5-6-5.5z" fill="white"/>
  </svg>
);

const UsdcIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#2775CA"/>
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="white"/>
    <path d="M12.75 13.69h-1.5v-3.38h-1.5V9h4.5v1.31h-1.5v3.38z" fill="white"/>
  </svg>
);

const JupIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#C9A6F9"/>
        <path d="M12 5.5L14.5 9h-5L12 5.5zM9.5 10l-4 4 4 4v-8zM14.5 10l4 4-4 4v-8zM12 18.5l-2.5-3.5h5L12 18.5z" fill="#2C2D2E"/>
    </svg>
);

const SolIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#14F195"/>
        <path d="M7.5 7.5h9v9h-9z" fill="white"/>
        <path d="M8.5 8.5h7v7h-7z" fill="#14F195"/>
        <path d="M9.5 9.5h5v5h-5z" fill="white"/>
    </svg>
);

const genericCryptoProps = {
    className: "h-6 w-6"
};

const currencyToIcon: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    BTC: (props) => <BtcIcon {...genericCryptoProps} {...props} />,
    ETH: (props) => <EthIcon {...genericCryptoProps} {...props} />,
    USDC: (props) => <UsdcIcon {...genericCryptoProps} {...props} />,
    JUP: (props) => <JupIcon {...genericCryptoProps} {...props} />,
    SOL: (props) => <SolIcon {...genericCryptoProps} {...props} />,
    USD: (props) => <DollarSign {...genericCryptoProps} {...props} />,
};

export const CryptoIcon = ({ currency, className }: { currency: string, className?: string }) => {
    const IconComponent = currencyToIcon[currency.toUpperCase()];
    if (IconComponent) {
        return <IconComponent className={className} />;
    }
    return <DollarSign className={className || genericCryptoProps.className} />;
};
