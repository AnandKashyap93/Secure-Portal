import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
    onVerify: (isValid: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
    const [captchaText, setCaptchaText] = useState('');
    const [inputValue, setInputValue] = useState('');

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let text = '';
        for (let i = 0; i < 6; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(text);
        setInputValue('');
        onVerify(false);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        onVerify(val === captchaText); // Case sensitive
    };

    return (
        <div className="flex flex-col gap-2 mb-6 p-6 rounded relative overflow-hidden group/captcha border border-foreground/10 bg-foreground/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/captcha:opacity-100 transition-opacity duration-700" />
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-light mb-2 relative z-10">Security Verification</label>
            <div className="flex gap-4 items-center mb-4 relative z-10">
                <div 
                    className="flex-1 bg-background/50 backdrop-blur-md border border-foreground/20 p-4 text-center text-2xl tracking-[0.5em] font-mono select-none relative overflow-hidden rounded shadow-inner flex items-center justify-center min-h-[80px]"
                    style={{
                        backgroundImage: 'radial-gradient(rgb(var(--color-text)) 1px, transparent 1px)',
                        backgroundSize: '15px 15px',
                        backgroundPosition: '0 0, 7.5px 7.5px'
                    }}
                >
                    <span className="relative z-10 font-bold text-foreground opacity-90 drop-shadow-md">{captchaText}</span>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        <line x1="0" y1="20" x2="100%" y2="60" stroke="currentColor" strokeWidth="2" />
                        <line x1="0" y1="60" x2="100%" y2="30" stroke="currentColor" strokeWidth="1" />
                        <line x1="30" y1="0" x2="70" y2="100%" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </div>
                <button 
                    type="button" 
                    onClick={generateCaptcha}
                    className="p-3 text-foreground/50 hover:text-foreground hover:bg-foreground/10 rounded-full transition-all duration-300 active:rotate-180"
                    title="Refresh Captcha"
                >
                    <RefreshCw size={20} strokeWidth={1} />
                </button>
            </div>
            <input 
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="ENTER VISIBLE TEXT"
                className={`w-full bg-transparent border-b py-3 outline-none font-light tracking-[0.3em] text-center transition-colors relative z-10 ${
                    inputValue.length > 0 && inputValue !== captchaText
                        ? 'border-red-500/50 text-red-500 focus:border-red-500 placeholder:text-red-500/30'
                        : inputValue.length > 0 && inputValue === captchaText
                            ? 'border-green-500/50 text-green-500 focus:border-green-500'
                            : 'border-foreground/20 text-foreground focus:border-foreground placeholder:text-foreground/20'
                }`}
                required
            />
        </div>
    );
}
