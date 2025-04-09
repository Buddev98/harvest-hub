import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import api from "../../../api";
import CustomPagination from "../../../components/CustomPagination";
import { Bed } from "../../../types";
import FormModel from "../../../components/FormModel";
import { useToast } from "../../../hooks/useToast";

const BedDetails: React.FC = () => {
  const [bed, setBed] = useState<Bed[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [bedId, setbedId] = React.useState<string>("");
  const [users, setUsers] = useState<any>([]);
  const { showToast } = useToast()

  const handleClick = (bedId: string, status: string) => {
    if (status == "Available") {
      setbedId(bedId);
      setIsDeleteModal(true);
    }

  };

  function CloseModal() {
    setIsDeleteModal(false)
  }
  const columns = [
    { header: "BED NUMBER", render: (bed: Bed) => bed.bedNumber },
    { header: "WARD", render: (bed: Bed) => bed.ward },
    { header: "STATUS", render: (bed: Bed) => bed.status },
  ];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderRowActions = (bed: Bed) => (
    <>
      <button
        className={`text-blue-500 cursor-pointer ${bed.status == 'Available'? "bg-yellow-600": "bg-yellow-500"}  rounded text-white hover:bg-yellow-500 p-2`}
        onClick={() => {
          if (bed._id && bed.status) {
            handleClick(bed._id, bed.status);
          }
        }}
      >
        {bed.status == "Available" ? "Assign" : "dispatch"}
      </button>
    </>
  );


  const getAllBed = async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/getbedlist?status=Available&page=${page}&limit=${limit}`);
      setBed(response.data.beds)
      setTotalPages(response.data.totalPages)
      setItemPerPage(response.data.limit)
    } catch (error) {
      showToast('error', 'Oops something went wrong, please try after some time', { position: "top-right" } )
    }
  };

  async function getUsers() {
    const users = await api.get("users-without-bookings")
    return users.data;
  }
  useEffect(() => {
    getAllBed(currentPage, itemPerPage);

  }, [currentPage, itemPerPage,isDeleteModal])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, [])

  return (
    <div >
      <div className="bg-gray-100  justify-center">
      {bed.length === 0 ? (
                <h6>No beds are available</h6>
            ) : (
        <Table<Bed>
          data={bed}
          columns={columns}
          renderRowActions={renderRowActions}
        />
          )}

      </div>
      <div style={{ float: 'right' }}>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemPerPage}
          totalItems={totalPages}
          onPageChange={handlePageChange}
        />
        <FormModel
          isOpen={isDeleteModal}
          onClose={CloseModal}
          userId={bedId}
          userddata={users}
        />
      </div>
    </div>
  );
};

export default BedDetails;
