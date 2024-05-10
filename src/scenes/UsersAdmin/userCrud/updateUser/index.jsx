import React, { useState, useEffect } from 'react';
import { updateAdmin } from 'services/usersService/api';
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from 'hooks/useAxiosPrivate';


function UpdateUser({ user, onClose, fetchData }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    password: user.passwordDecoded || '',
    verified: user.verified || true,
    roles: user.roles || ['admin'],
    address: user.address || '',
    gender: user.gender || '',
    phoneNumber1: user.phoneNumber1 || '',
    phoneNumber2: user.phoneNumber2 || '',
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', // Format dateOfBirth
    // Add other necessary fields here
  });

  const [errors, setErrors] = useState({});
  const [formChanged, setFormChanged] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();





  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: user.passwordDecoded || '',
      verified: user.verified || true,
      roles: user.roles || ['admin'],
      address: user.address || '',
      gender: user.gender || '',
      phoneNumber1: user.phoneNumber1 || '',
      phoneNumber2: user.phoneNumber2 || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', // Format dateOfBirth
      // Add other necessary fields here
    });
    setFormChanged(false); // Reset form changed state

  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    setFormChanged(true); // Set form changed state to true

  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        error = value.trim() === "" ? t("add_user.errors.first_name_required") : "";
        break;
      case "lastName":
        error = value.trim() === "" ? t("add_user.errors.last_name_required") : "";
        break;
      case "email":
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : t("add_user.errors.email_invalid");;
        break;
      case "password":
        error =
          value.length < 6
            ? t("add_user.errors.password_length")
            : "";
        break;
      case "address":
        error =
          value.trim() === "" || value.length < 6
            ? t("add_user.errors.address_required")
            : "";
        break;
      case "gender":
        error = value === "" ? t("add_user.errors.gender_required")  : "";
        break;
      case "phoneNumber1":
        error =
          /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(
            value
          )
            ? ""
            : t("add_user.errors.phone_number_invalid");
        break;
      case "phoneNumber2":
        // Validate phone number 2 only if a value is provided
        if (value.trim() !== "") {
          error =
            /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(
              value
            )
              ? ""
              : t("add_user.errors.phone_number_invalid");
        }
        break;
      case "dateOfBirth":
        error = value === "" ?  t("add_user.errors.date_of_birth_required") : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) {
        formErrors[key] = errors[key];
      }
    });
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    setOpen(true);

    try {
      const response = await updateAdmin(user._id, formData, axiosPrivate);
      if (response.status === 200) {
        toast.success(t("admins_dashboard.success"), { autoClose: 2000,style: { color: "green" }, });
        setOpen(false);

        setTimeout(() => {
          onClose();
          fetchData();
        }, 1500); // 1500 milliseconds delay, same as autoClose time
      }
    }  catch (error) {
      setOpen(false);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error(t("admins_dashboard.not_found"), { autoClose: 2000, style: { color: "red" }, });
        } else if (error.response.status === 400) {
          toast.error(t("admins_dashboard.add_admin_exist"), { autoClose: 2000, style: { color: "red" }, });
        } else {
          toast.error(t("admins_dashboard.update_error"), { autoClose: 2000, style: { color: "red" }, });
        }
      } else {
        toast.error(t("admins_dashboard.update_error"), { autoClose: 2000, style: { color: "red" }, });
      }
      console.error('Error updating user:', error);
    }
  };

  const isFormDisabled = () => {
    // Check if any field in the form data is different from the corresponding field in the original user data
    return Object.keys(formData).every((key) => formData[key] === user[key]);
  };


  return (
    <div className="page-content-wrapper border">
            <ToastContainer />

      <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
      <div className="container position-relative">
        <button className="btn btn-link text-danger position-absolute top-0 end-0 m-3" onClick={onClose} style={{ fontSize: '1.3rem' }}>
          <i className="bi bi-x-lg"></i>
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <h5 className="font-base">{t("add_user.header_update")}</h5>
            <div>
              <div className="accordion-body mt-3">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0"> {t("add_user.first_name")}<span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.last_name")} <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.email")} <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.password")} <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.address")}<span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.gender")} <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                        >
                          <option value="">{t("add_user.select_gender")}</option>
                          <option value="Male">{t("add_user.male")}</option>
                          <option value="Female">{t("add_user.female")}</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.phone_number_1")} <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber1"
                          value={formData.phoneNumber1}
                          onChange={handleChange}
                          className={`form-control ${errors.phoneNumber1 ? 'is-invalid' : ''}`}
                        />
                        {errors.phoneNumber1 && <div className="invalid-feedback">{errors.phoneNumber1}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.phone_number_2")}</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber2"
                          value={formData.phoneNumber2}
                          onChange={handleChange}
                          className={`form-control ${errors.phoneNumber2 ? 'is-invalid' : ''}`}
                        />
                        {errors.phoneNumber2 && <div className="invalid-feedback">{errors.phoneNumber2}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">{t("add_user.date_of_birth")}<span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                        />
                        {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={!formChanged || isFormDisabled()}>
              {t("add_user.update_button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
