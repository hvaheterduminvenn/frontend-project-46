const getDifference = (file1data, file2data) => {
  const data1 = { ...file1data };
  const data2 = { ...file2data };
  const difference = [];

  Object.entries(data1).forEach(([key1, value1]) => {
    if (data2.key1 !== undefined) {
      if (value1 === data2[key1]) {
        difference.push(`${key1}: ${value1} 3`);
      } else {
        difference.push(`${key1}: ${value1} 1`);
        difference.push(`${key1}: ${data2[key1]} 2`);
      }
      delete data2[key1];
    } else {
      difference.push(`${key1}: ${value1} 1`);
    }
  });

  Object.entries(data2).forEach(([key2, value2]) => {
    difference.push(`${key2}: ${value2} 2`);
  });

  difference.sort((a, b) => {
    const [keyA, , indexA] = a.split(' ');
    const [keyB, , indexB] = b.split(' ');
    let value;

    if (keyA > keyB) {
      value = 1;
    } else if (keyA < keyB) {
      value = -1;
    } else if (indexA > indexB) {
      value = 1;
    } else if (indexA < indexB) {
      value = -1;
    }

    return value;
  });

  return difference;
};

export default getDifference;
