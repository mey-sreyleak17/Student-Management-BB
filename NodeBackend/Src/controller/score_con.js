const db = require("../config/db");
const {logerror, isEmptyorNull}=require("../config/helper");
exports.getReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        st.Id,
        st.StudentCode,
        st.Name AS StudentName,

        MAX(
          CASE
            WHEN sub.SubjectName = 'English'
            THEN sc.Score
          END
        ) AS English,

        MAX(
          CASE
            WHEN sub.SubjectName = 'Math'
            THEN sc.Score
          END
        ) AS Math,

        MAX(
          CASE
            WHEN sub.SubjectName = 'Science'
            THEN sc.Score
          END
        ) AS Science,

        MAX(
          CASE
            WHEN sub.SubjectName = 'History'
            THEN sc.Score
          END
        ) AS History

      FROM students st

      LEFT JOIN scores sc
        ON sc.StudentId = st.Id

      LEFT JOIN exams ex
        ON ex.Id = sc.ExamId

      LEFT JOIN subjects sub
        ON sub.Id = ex.SubjectId

      GROUP BY
        st.Id,
        st.StudentCode,
        st.Name

      ORDER BY st.Name
    `);

    res.json(rows);
  } catch (error) {
     logerror("Get Report Score",error,res);
  }
};
exports.getStudentScores =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const [rows] =
        await db.query(
          `
        SELECT
          sc.Id,
          sc.ExamId,
          sc.Score,
          sc.Grade,
          sc.Remark,
          sc.CreateAt
        FROM scores sc
        WHERE sc.StudentId = ?
        ORDER BY sc.CreateAt DESC
      `,
          [id]
        );

      res.status(200).json(
        rows
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
      });
    }
  };
  exports.createScore = async (
  req,
  res
) => {
  try {
    const {
      StudentId,
      ExamId,
      Score,
      Remark,
    } = req.body;

    let Grade = "F";

    if (Score >= 90)
      Grade = "A";
    else if (Score >= 80)
      Grade = "B";
    else if (Score >= 70)
      Grade = "C";
    else if (Score >= 60)
      Grade = "D";

    await db.query(
      `
      INSERT INTO scores
      (
        StudentId,
        ExamId,
        Score,
        Grade,
        Remark
      )
      VALUES
      (?, ?, ?, ?, ?)
    `,
      [
        StudentId,
        ExamId,
        Score,
        Grade,
        Remark,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Score added successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};
exports.updateScore = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const {
      Score,
      Remark,
    } = req.body;

    let Grade = "F";

    if (Score >= 90)
      Grade = "A";
    else if (Score >= 80)
      Grade = "B";
    else if (Score >= 70)
      Grade = "C";
    else if (Score >= 60)
      Grade = "D";

    await db.query(
      `
      UPDATE scores
      SET
        Score=?,
        Grade=?,
        Remark=?
      WHERE Id=?
    `,
      [
        Score,
        Grade,
        Remark,
        id,
      ]
    );

    res.json({
      success: true,
      message:
        "Score updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};
