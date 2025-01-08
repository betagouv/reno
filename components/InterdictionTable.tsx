export default function InterdictionTable() {
  return (
    <table style={{ width: '100%', margin: '1rem' }}>
      <tr>
        <td style={{ paddingBottom: '1rem' }}>
          Au 1er janvier <strong>2025</strong>
        </td>
        <td style={{ paddingBottom: '1rem' }}>
          Interdiction de louer <br />
          un DPE{' '}
          <span
            style={{
              background: '#d7221f',
              borderRadius: '0.3rem',
              color: 'white',
              padding: '0.05rem 0.45rem',
            }}
          >
            G
          </span>
        </td>
      </tr>
      <tr>
        <td style={{ paddingBottom: '1rem' }}>
          Au 1er janvier <strong>2028</strong>
        </td>
        <td style={{ paddingBottom: '1rem' }}>
          Interdiction de louer <br />
          un DPE{' '}
          <span
            style={{
              background: '#eb8235',
              borderRadius: '0.3rem',
              color: 'black',
              padding: '0.05rem 0.45rem',
            }}
          >
            F
          </span>
        </td>
      </tr>
      <tr>
        <td style={{ paddingBottom: '1rem' }}>
          Au 1er janvier <strong>2034</strong>
        </td>
        <td style={{ paddingBottom: '1rem' }}>
          Interdiction de louer <br />
          un DPE{' '}
          <span
            style={{
              background: '#f0b50f',
              borderRadius: '0.3rem',
              color: 'black',
              padding: '0.05rem 0.45rem',
            }}
          >
            E
          </span>
        </td>
      </tr>
    </table>
  )
}
