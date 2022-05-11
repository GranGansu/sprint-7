import styled from 'styled-components'

const Panel = styled.div`
border: 2px solid black;
padding: 20px;
display: ${props=>props.display};
border-radius: 4px;
max-width: 500px;
margin: 20px auto;`

export default Panel