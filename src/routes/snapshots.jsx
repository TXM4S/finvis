import { useEffect, useState } from "react";
import MenuItem from "../components/menuitem";
import ChartAndArticles from "../components/chartandarticles";
import { UserContext } from "../contexts/user";
import { getUID, listSnapshots, getSnapshot } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

const Snapshots = () => {
  const { user, isLoading } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [stockData, setStockData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, navigate, isLoading]);

  useEffect(() => {
    if (!isLoading && user) {
      listSnapshots({ uid: getUID() }).then((result) => {
        console.log(result);
        setList(result.data);
      });
    }
  }, [isLoading, user]);

  const handleMenuClick = (id) => {
    getSnapshot({ id }).then((result) => {
      console.log(result);
      setStockData(result.data.stockData);
      setNewsData(result.data.newsData);
      setName(result.data.name);
    });
  };

  const menuitems = list ? (
    list.map((item) => {
      return (
        <MenuItem
          name={item.name}
          dateRange={item.dateRange}
          handleClick={(el) => handleMenuClick(item.id)}
        />
      );
    })
  ) : (
    <></>
  );

  return (
    <div className="flex flex-col space-y-10 items-center">
      <h1 className="ml-10 text-5xl font-black self-start"> SNAPSHOTS </h1>
      <div className="flex flex-row">
        <div className="card ml-10 bg-base-200 shadow-xl w-fit p-2">
          <ul className="menu bg-base-200 w-64 h-100">{menuitems}</ul>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        {stockData.length !== 0 ? (
          <ChartAndArticles
            stockData={stockData}
            newsData={newsData}
            title={name}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Snapshots;
