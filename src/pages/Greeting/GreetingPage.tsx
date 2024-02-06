//This's only example of the template

import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import reactLogo from '@/assets/images/react.svg';
import viteLogo from '@/assets/images/vite.svg';

import '../../App.css';

const GreetingPage = () => {
  return (
    <PageWrapper>
      <ContentWrapper>
        <>
          <div className="flex justify-center">
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <div>
            <h1>Vite + React</h1>
            <div className="card">
              <p>
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </div>
        </>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default GreetingPage;
