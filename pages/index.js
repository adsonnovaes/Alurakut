import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(prosps) {

  return (
    <Box as="aside">
      <img src={`https://github.com/${prosps.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${prosps.githubUser}`}>
          @{prosps.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />

    </Box>
  )
}

function ProfilerelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      {/* <ul>
        {props.items.map((itemAtual, index) => {
          return (
            <li key={itemAtual}>
              <a href={`/users/${itemAtual}`}>
                <img src={`https://github.com/${itemAtual}.png`} />
                <span>{itemAtual}</span>
              </a>
            </li>
          )
        })}
      </ul> */}
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {

  const githubUser = 'adsonnovaes';
  const [comunidades, setComunidades] = React.useState([]);;

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ];
  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(() => {
    fetch('https://api.github.com/users/peas/followers')
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        setSeguidores(responseJson);
      })

    //API GraphQl
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '24727aa2f84f9d9c25a82c1f6120a5',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `
            query {
              allCommunities{
                title
                id
                imageUrl
                creatorSlug
              }
            }`
      })
    })
    .then(response => {
      return response.json();
    })
    .then(responseComplete => {
      //comunidades que estão vindo, via requisição, do dato cms
      const cvdd = responseComplete.data.allCommunities;

      setComunidades(cvdd);
      console.log(responseComplete);
    })

  }, [])

  function handleCreateCummunity(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const comunidade = {
      title: formData.get('title'),
      imageUrl: formData.get('image'),
      creatorSlug: githubUser
    }

    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunidade)
    })
    .then(async (response) => {
      const dados = await response.json();
      const comunidadeResponse = dados.record;
      setComunidades([...comunidades, comunidadeResponse])
    })

  }

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem Vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle" >O que você deseja fazer?</h2>
            <form onSubmit={handleCreateCummunity} >
              <div>
                <input
                  placeholder="Qual vai ser o nome da comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da comunidade?"
                  type="text" />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button type="submit" >
                Criar Comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfilerelationsBox
            title="Seguidores"
            items={seguidores}
          />

          {/* <ProfilerelationsBox
            title="Pessoas da Comunidade"
            items={pessoasFavoritas}
          />

          <ProfilerelationsBox
            title="Comunidades"
            items={comunidades}
          /> */}

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((itemAtual, index) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual, index) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          {/* <Box>
            Bem vindo
          </Box> */}
        </div>


      </MainGrid>
    </>
  );
}
