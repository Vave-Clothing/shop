import withJoi from "next-joi";

export default withJoi({
  onValidationError: (_, res, error) => {
    return res.status(400).send({ code: 400, message: error.details[0].message });
  },
});