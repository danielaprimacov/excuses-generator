import Categories from "./Categories";
import LatestResults from "./LatestResults";
import WelcomeBanner from "./WelcomeBanner";

function Home() {
  return (
    <>
      <WelcomeBanner />
      <LatestResults />
      <Categories />
    </>
  );
}

export default Home;
