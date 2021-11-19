export default async ({ redirect, store }) => {
    let { isActive: clubIsActive } = store.state.club;
    let { authStrategy } = store.state.info;
    if(!!authStrategy) {
        let { type: authType, isRequired: authIsRequired } = authStrategy
        if((authType !== 'NoAuth') && authIsRequired && !clubIsActive) {
            redirect('https://lamasoo.ir/en/home/')
        }
    }
}