export async function web3RequestWrite(
    contract: any,
    method: string,
    params: any,
    from: string
) {
    let transactionHash = ''
    let success = false
    let message = ''
    let code = 0;

    try {
        await contract.methods[method](...params).send({ from: from })
            .on('transactionHash', (hash: string) => {
                transactionHash = hash
                success = true
                message = "Transaction sent successfully"
            })
            .on("error", () => {
                // throw new Web3ErrorService(error, receipt);
                success = false;
                message = 'Erro na sua transação';
            })
    } catch (e) {
        message = 'Erro na sua transação';
        success = false;
    }

    return {
        success,
        message,
        transactionHash,
        code
    }
}