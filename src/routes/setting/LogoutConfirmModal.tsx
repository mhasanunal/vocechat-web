import { ChangeEvent, FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../common/component/Modal";
import StyledModal from "../../common/component/styled/Modal";
import Button from "../../common/component/styled/Button";
import Checkbox from "../../common/component/styled/Checkbox";
import useLogout from "../../common/hook/useLogout";
import { useTranslation } from "react-i18next";


interface Props {
  closeModal: () => void;
}

const LogoutConfirmModal: FC<Props> = ({ closeModal }) => {
  const { t } = useTranslation("auth");
  const { t: ct } = useTranslation();
  const [clearLocal, setClearLocal] = useState(false);
  const { logout, exited, exiting, clearLocalData } = useLogout();
  const handleLogout = () => {
    logout();
  };

  const handleCheck = (evt: ChangeEvent<HTMLInputElement>) => {
    setClearLocal(evt.target.checked);
  };

  useEffect(() => {
    if (exited) {
      if (clearLocal) {
        clearLocalData();
      }
      toast.success(ct("tip.logout"));
    }
  }, [exited, clearLocal]);

  return (
    <Modal id="modal-modal">
      <StyledModal
        title={t("logout.title")}
        description={t("logout.desc")}
        buttons={
          <>
            <Button className="cancel" onClick={closeModal}>{ct("action.cancel")}</Button>
            <Button onClick={handleLogout} className="danger">
              {exiting ? "Logging out" : ct("action.logout")}
            </Button>
          </>
        }
      >
        <div className="text-sm text-gray-400 flex justify-end items-center">
          <label htmlFor="clear_cb" className="cursor-pointer text-orange-500 mr-3">
            {t("logout.clear_local")}
          </label>
          <Checkbox className=" cursor-pointer" name="clear_cb" checked={clearLocal} onChange={handleCheck} />
        </div>
      </StyledModal>
    </Modal>
  );
};

export default LogoutConfirmModal;
