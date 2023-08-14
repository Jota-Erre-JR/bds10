import './styles.css';
import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { SpringPage } from 'types/vendor/spring';
import { useCallback, useEffect, useState } from 'react';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { hasAnyRoles } from 'util/auth';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [isLoading, setIsLoading] = useState(false);

  const [controlComponentData, setControlComponentData] =
    useState<ControlComponentsData>({
      activePage: 0,
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentData({
      activePage: pageNumber,
    });
  };

  const getEmployees = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: controlComponentData.activePage,
        size: 4,
      },
    };

    setIsLoading(true);
    requestBackend(config)
      .then((response) => {
        setPage(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [controlComponentData]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return (
    <>
      <div>
        <Link to="/admin/employees/create">
          {hasAnyRoles(['ROLE_ADMIN']) && (
            <button className="btn btn-primary text-white btn-crud-add">
              ADICIONAR
            </button>
          )}
        </Link>
      </div>
      <div className="row">
        {page?.content.map((employee) => (
          <div key={employee.id}>
            <EmployeeCard employee={employee} />
          </div>
        ))}
        ;
      </div>
      <div className="row pagination-container">
        <Pagination
          forcePage={page?.number}
          pageCount={page ? page.totalPages : 0}
          range={3}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default List;
