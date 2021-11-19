import src from "./src"

export default src.reduce((acc, curr) => ({ ...acc, [curr.en]: curr.en }), {})