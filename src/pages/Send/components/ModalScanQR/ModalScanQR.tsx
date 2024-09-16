import QrCodeScanner from "../../../../components/QrCodeScanner/QrCodeScanner";

interface Props{
    close: () => void;
    scanned: (url: string) => void;
}

export function ModalScanQR({close, scanned}: Props){
    return(
        <div className='flex justify-center items-center inset-0 '>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0 '/>

            <div className='absolute flex flex-col justify-between p-3 lg:w-[300px] lg:h-[300px] bg-container-primary rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-10'>
                <QrCodeScanner
                    scanned={(url) => {
                        scanned(url);
                        close();
                    }}
                />
            </div>
        </div>
    )
}