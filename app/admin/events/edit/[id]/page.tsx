import EditEventClient from "./EditEventClient";

type Props = {
  params: {
    id: string;
  };
};

export default function EditEventPage(props: Props) {
  return <EditEventClient id={props.params.id} />;
}
