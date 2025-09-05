import Swal from "sweetalert2"

const successAlert = (title) => {
  const alert = Swal.fire({
    icon: "question",
    title: title,
    confirmButtonColor: "#00b050"
  });

  return alert;
};

export default successAlert;
