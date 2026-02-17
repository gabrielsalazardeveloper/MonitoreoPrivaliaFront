import RoutesPublicas from '@/routes/RoutesPublicas'
import RoutesToken from '@/routes/RoutesToken'
//LOGO
import { useUserContenido } from '@/hooks/UserConteProvider'

const App = () => {
  //:::::::::::::::::::::: UserConteProvider [CONTEXT] :::::::::::::::::::::::
  const { contenidoHooks, setContenidoHooks } = useUserContenido();
  return (
    <>
      <div>
        {
          !contenidoHooks.Sesion ? (
            <RoutesPublicas
            />
          ) : (
            <RoutesToken
            />
          )}
      </div>
    </>
  );
}

export default App;
