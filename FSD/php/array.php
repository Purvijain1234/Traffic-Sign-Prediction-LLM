<?php

echo "<h1>PHP Arrays</h1>";

$colors = array("Red", "Green", "Blue", "Yellow");
echo "<h2>Indexed Array</h2>";
foreach ($colors as $value) {
    echo "$value <br>";
}

echo "<h2>Associative Array</h2>";

$students = [[
    "name" => "Purvi",
    "age" => 19,
    "course" => "B.Tech AI"
],
[
    "name" => "John",
    "age" => 20,
    "course" => "B.Tech CS"
]
];

foreach ($students as $student) {
    echo "Name: " . $student["name"] . "<br>";
    echo "Age: " . $student["age"] . "<br>";
    echo "Course: " . $student["course"] . "<br><br>";
}

?>