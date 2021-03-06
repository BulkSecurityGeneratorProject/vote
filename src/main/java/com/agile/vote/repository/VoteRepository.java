package com.agile.vote.repository;

import com.agile.vote.domain.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.time.ZonedDateTime;
import java.util.List;


/**
 * Spring Data JPA repository for the Vote entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    /**
     * 获取可用的投票列表
     * @param now
     * @param now2
     * @param deleted
     * @return
     */
    List<Vote> findByStartDateBeforeAndEndDateAfterAndDeleted(ZonedDateTime now, ZonedDateTime now2, Boolean deleted);

    /**
     * 获取所有有效投票列表
     * @param deleted
     * @param pageable
     * @return
     */
    Page<Vote> findByDeleted(Boolean deleted, Pageable pageable);
}
