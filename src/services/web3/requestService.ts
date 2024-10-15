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
                message = 'Erro ao processar sua transação'
            })
    } catch (e) {
        message = 'Erro ao processar sua transação'
    }

    return {
        success,
        message,
        transactionHash,
        code
    }
}