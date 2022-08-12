import { Link, Outlet } from 'umi';

const Layout = () => {
  return (
    <>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/docs">Docs</Link>
          </li>
          <li>
            <a href="https://github.com/umijs/umi">Github</a>
          </li>
        </ul>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
