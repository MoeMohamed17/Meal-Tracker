import { Table, Title } from "@mantine/core";
import styles from './Table.css';


export default function CountTable({ countData, attr1, attr2, title }) {
    console.log(countData);
    const rows = countData.map((data) => (
        <Table.Tr key={data[attr1]}>
            <Table.Td>{data[attr1]}</Table.Td>
            <Table.Td>{data[attr2]}</Table.Td>
        </Table.Tr>
    ));

    return (
        <div style={{paddingTop:'20px', paddingLeft:'20px', paddingRight:'20px'}}>
            <div style={{paddingBottom:'10px'}}>
                <Title>{title}</Title>
            </div>
            <Table>
                <Table.Thead>
                <Table.Tr>
                    <Table.Th>{attr1}</Table.Th>
                    <Table.Th>{attr2}</Table.Th>
                </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>

    );
}