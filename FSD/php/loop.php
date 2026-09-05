<?php

$Title = "PHP Loops";
echo "<h1>" . $Title . "</h1>";

echo "<h2>While Loop</h2>";
$i = 1;
while($i <= 5) {
    echo "The number is: $i <br>";
    $i++;
}

echo "<h2>Do While Loop</h2>";
$j = 1;
do {
    echo "The number is: $j <br>";
    $j++;
} while ($j <= 5);

echo "<h2>For Loop</h2>";
for ($k = 1; $k <= 5; $k++) {
    echo "The number is: $k <br>";
}

echo "<h2>Foreach Loop</h2>";
$colors = array("Red", "Green", "Blue", "Yellow");
foreach ($colors as $value) {
    echo "$value <br>";
}

?>