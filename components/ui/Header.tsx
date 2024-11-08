import Image from 'next/image';

export const Header = () => {
    return (
        <header className="flex justify-center w-full">
            <Image
                src="/memo.svg"
                alt="Logo Memo"
                width={240}
                height={120}
                priority
                draggable={false}
                className="select-none"
            />
        </header>
    );
}; 